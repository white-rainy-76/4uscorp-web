import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import {
  UpdateTollPayload,
  UpdateTollPayloadSchema,
} from './payload/update-toll.payload'
import { TollDtoSchema } from '@/entities/tolls/api/contracts/tolls.dto.contract'
import { mapToll } from '@/entities/tolls/api/mapper/tolls.mapper'
import { Toll } from '@/entities/tolls'
import { useAuthStore } from '@/shared/store/auth-store'

export const updateToll = async (
  id: string,
  payload: UpdateTollPayload,
  signal?: AbortSignal,
): Promise<Toll> => {
  const validatedPayload = UpdateTollPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .put(`/tolls-api/api/Tolls/${id}`, validatedPayload, authConfig)
    .then(responseContract(TollDtoSchema))

  return mapToll(response.data)
}
