import { useMutation } from '@tanstack/react-query'
import { getDirections } from './get-directions'

export const useGetDirections = () =>
  useMutation({
    mutationFn: getDirections,
  })
