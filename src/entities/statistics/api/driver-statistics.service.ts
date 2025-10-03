import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { DriverStatisticsDtoSchema } from './contracts/driver-statistics.contract'
import { useAuthStore } from '@/shared/store/auth-store'

interface GetDriversByReportParams {
  FileReportId: string
}

export function getDriversByReport(
  params: GetDriversByReportParams,
  config?: AxiosRequestConfig,
) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Report/drivers-by-report`, {
      ...authConfig,
      params: {
        FileReportId: params.FileReportId,
      },
    })
    .then(responseContract(DriverStatisticsDtoSchema.array()))
}
