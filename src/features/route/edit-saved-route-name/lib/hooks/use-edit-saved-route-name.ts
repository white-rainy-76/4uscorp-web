import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SavedRouteItem } from '@/features/route/saved-routes-selector'
import { useEditSavedRouteNameMutation } from '../../api/edit-saved-route-name.mutation'

type EditSavedRouteNameParams = {
  savedRouteId: string
  routeName: string | null
}

type RollbackSnapshot = {
  allSaved?: SavedRouteItem[]
  searchedSaved?: Array<[unknown, unknown]>
}

export function useEditSavedRouteName() {
  const queryClient = useQueryClient()
  const rollbackRef = useRef<RollbackSnapshot | null>(null)

  const { mutate, isPending } = useEditSavedRouteNameMutation({
    onSuccess: () => {
      toast.success('Route name updated')
    },
    onError: (error) => {
      // Rollback optimistic update
      if (rollbackRef.current) {
        if (rollbackRef.current.allSaved) {
          queryClient.setQueryData<SavedRouteItem[]>(
            ['routes', 'all-saved-route'],
            rollbackRef.current.allSaved,
          )
        }

        if (rollbackRef.current.searchedSaved) {
          rollbackRef.current.searchedSaved.forEach(([key, data]) => {
            queryClient.setQueryData<SavedRouteItem[]>(
              key as unknown as any,
              data as SavedRouteItem[],
            )
          })
        }
      }

      toast.error(`Failed to update route name: ${error.message}`)
    },
    onSettled: () => {
      rollbackRef.current = null
      queryClient.invalidateQueries({ queryKey: ['routes', 'all-saved-route'] })
      queryClient.invalidateQueries({ queryKey: ['routes', 'saved-routes'] })
    },
  })

  const applyOptimisticName = (
    savedRouteId: string,
    routeName: string | null,
  ) => {
    const update = (old?: SavedRouteItem[]) => {
      if (!old) return old
      return old.map((r) =>
        r.id === savedRouteId ? { ...r, name: routeName } : r,
      )
    }

    const allKey = ['routes', 'all-saved-route'] as const
    const prevAll = queryClient.getQueryData<SavedRouteItem[]>(allKey)
    queryClient.setQueryData<SavedRouteItem[]>(
      allKey,
      (old) => (update(old) ?? old) as SavedRouteItem[],
    )

    const prevSearched = queryClient.getQueriesData({
      queryKey: ['routes', 'saved-routes'],
    })
    prevSearched.forEach(([key, data]) => {
      queryClient.setQueryData<SavedRouteItem[]>(
        key as unknown as any,
        (update(data as SavedRouteItem[]) ??
          (data as SavedRouteItem[])) as SavedRouteItem[],
      )
    })

    rollbackRef.current = {
      allSaved: prevAll,
      searchedSaved: prevSearched,
    }
  }

  const editSavedRouteName = async ({
    savedRouteId,
    routeName,
  }: EditSavedRouteNameParams) => {
    await Promise.all([
      queryClient.cancelQueries({ queryKey: ['routes', 'all-saved-route'] }),
      queryClient.cancelQueries({ queryKey: ['routes', 'saved-routes'] }),
    ])

    applyOptimisticName(savedRouteId, routeName)

    mutate({ savedRouteId, routeName })
  }

  return {
    editSavedRouteName,
    isPending,
  }
}
