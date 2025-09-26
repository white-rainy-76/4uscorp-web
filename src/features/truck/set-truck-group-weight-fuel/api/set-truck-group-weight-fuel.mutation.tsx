import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setTruckGroupWeightFuel } from './set-truck-group-weight-fuel.service'
import { SetTruckGroupWeightFuelPayload } from './payload/set-truck-group-weight-fuel.payload'
import { TRUCK_GROUPS_ROOT_QUERY_KEY } from '@/entities/truck/api/truck.queries'
import { queryClient } from '@/shared/api/query-client'
import { truckGroupQueries } from '@/entities/truck'
import { TruckGroup } from '@/entities/truck'

export const useSetTruckGroupWeightFuelMutation = () => {
  return useMutation({
    mutationFn: (payload: SetTruckGroupWeightFuelPayload) =>
      setTruckGroupWeightFuel(payload),

    onMutate: async (variables) => {
      // Оптимистично обновляем данные truck group
      const previousTruckGroups = queryClient.getQueryData(
        truckGroupQueries.lists(),
      )

      if (previousTruckGroups) {
        const updatedTruckGroups = (previousTruckGroups as TruckGroup[]).map(
          (group) =>
            group.id === variables.truckGroupId
              ? {
                  ...group,
                  weight: variables.weight,
                  fuelCapacity: variables.fuelCapacity,
                }
              : group,
        )

        queryClient.setQueryData(truckGroupQueries.lists(), updatedTruckGroups)
      }

      return { previousTruckGroups }
    },

    onSuccess: () => {
      // Инвалидируем кеш truck groups после успешного обновления
      queryClient.invalidateQueries({
        queryKey: TRUCK_GROUPS_ROOT_QUERY_KEY,
      })
    },

    onError: (error, variables, context) => {
      // Откатываем оптимистичное обновление при ошибке
      if (context?.previousTruckGroups) {
        queryClient.setQueryData(
          truckGroupQueries.lists(),
          context.previousTruckGroups,
        )
      }
    },
  })
}
