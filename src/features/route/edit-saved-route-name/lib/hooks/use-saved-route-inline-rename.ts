import { useEffect, useMemo, useRef, useState } from 'react'
import { SavedRouteItem } from '@/features/route/saved-routes-selector'
import { useEditSavedRouteName } from './use-edit-saved-route-name'

export type UseSavedRouteInlineRenameResult = {
  inputRef: React.RefObject<HTMLInputElement>
  editingRouteId: string | null
  draftName: string
  isSaving: boolean
  startEditing: (route: SavedRouteItem) => void
  cancelEditing: () => void
  setDraftName: (value: string) => void
  commitEditing: () => Promise<void>
}

export function useSavedRouteInlineRename(
  routes: SavedRouteItem[],
): UseSavedRouteInlineRenameResult {
  const inputRef = useRef<HTMLInputElement>(null)

  const [editingRouteId, setEditingRouteId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState<string>('')

  const { editSavedRouteName, isPending } = useEditSavedRouteName()

  const routeBeingEdited = useMemo(() => {
    if (!editingRouteId) return null
    return routes.find((r) => r.id === editingRouteId) ?? null
  }, [editingRouteId, routes])

  useEffect(() => {
    if (!editingRouteId) return
    queueMicrotask(() => inputRef.current?.focus())
  }, [editingRouteId])

  const startEditing = (route: SavedRouteItem) => {
    setEditingRouteId(route.id)
    setDraftName((route.name ?? route.startAddress ?? '').toString())
  }

  const cancelEditing = () => {
    setEditingRouteId(null)
  }

  const commitEditing = async () => {
    if (!editingRouteId) return
    const id = editingRouteId

    const trimmed = draftName.trim()
    const nextName: string | null = trimmed.length > 0 ? trimmed : null

    const currentName = (routeBeingEdited?.name ?? null) as string | null
    if (currentName === nextName) {
      setEditingRouteId(null)
      return
    }

    setEditingRouteId(null)

    await editSavedRouteName({
      savedRouteId: id,
      routeName: nextName,
    })
  }

  return {
    inputRef,
    editingRouteId,
    draftName,
    isSaving: isPending,
    startEditing,
    cancelEditing,
    setDraftName,
    commitEditing,
  }
}
