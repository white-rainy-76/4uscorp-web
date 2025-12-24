import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { GetTollsByBoundingBoxPayload } from '../model'
import { GetTollsByBoundingBoxResponse } from '../model'
import { GetTollsByBoundingBoxPayloadSchema } from './payload/tolls.payload'

import { GetTollsByBoundingBoxResponseDtoSchema } from './contracts/tolls.dto.contract'
import { mapGetTollsByBoundingBox } from './mapper/tolls.mapper'
import { useAuthStore } from '@/shared/store/auth-store'

export const getTollsByBoundingBox = async (
  payload: GetTollsByBoundingBoxPayload,
  signal?: AbortSignal,
): Promise<GetTollsByBoundingBoxResponse> => {
  const validatedPayload = GetTollsByBoundingBoxPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .get(`/tolls-api/api/Tolls/by-bounding-box`, {
      ...authConfig,
      params: {
        minLat: validatedPayload.minLat,
        minLon: validatedPayload.minLon,
        maxLat: validatedPayload.maxLat,
        maxLon: validatedPayload.maxLon,
      },
    })
    .then(responseContract(GetTollsByBoundingBoxResponseDtoSchema))

  return mapGetTollsByBoundingBox(response.data)
}
