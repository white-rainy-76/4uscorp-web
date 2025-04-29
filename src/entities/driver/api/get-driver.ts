import { apiClient } from '@/shared/api/base'
import { Driver } from '../model'
import { DriverQuery } from './query/driver.query'

export const getDriver = async ({ id }: DriverQuery): Promise<Driver> => {
  // ! change route
  const result = await apiClient.get<Driver>(`/api/Trucks/get-truck-list`, {
    id,
  })

  return result
}
