import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { StatisticsResponseDtoSchema } from './contracts/statistics.contract'
import { useAuthStore } from '@/shared/store/auth-store'

interface GetStatisticsParams {
  reportId: string | null
  driverId: string | null
}

export function getStatistics(
  params: GetStatisticsParams,
  config?: AxiosRequestConfig,
) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Report/Reports`, {
      ...authConfig,
      params: {
        reportId: params.reportId,
        driverId: params.driverId,
      },
    })
    .then(responseContract(StatisticsResponseDtoSchema))
}
