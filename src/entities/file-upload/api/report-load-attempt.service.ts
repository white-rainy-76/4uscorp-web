import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { ReportLoadAttemptsResponseSchema } from './contracts/report-load-attempt.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export function getReportLoadAttempts(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/truckstracking-api/Transaction/report-load-attempts`, authConfig)
    .then(responseContract(ReportLoadAttemptsResponseSchema))
}
