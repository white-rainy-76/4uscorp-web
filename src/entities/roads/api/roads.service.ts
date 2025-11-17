import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { GetRoadsByBoundingBoxPayload } from '../model/types/roads.payload'
import { GetRoadsByBoundingBoxResponse } from '../model/types/roads'
import { GetRoadsByBoundingBoxPayloadSchema } from './payload/roads.payload'

import { GetRoadsByBoundingBoxResponseDtoSchema } from './contracts/roads.dto.contract'
import { mapGetRoadsByBoundingBox } from './mapper/roads.mapper'
import { useAuthStore } from '@/shared/store/auth-store'

export const getRoadsByBoundingBox = async (
  payload: GetRoadsByBoundingBoxPayload,
  signal?: AbortSignal,
): Promise<GetRoadsByBoundingBoxResponse> => {
  const validatedPayload = GetRoadsByBoundingBoxPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .get(`/tolls-api/api/Roads/by-bounding-box`, {
      ...authConfig,
      params: {
        minLat: validatedPayload.minLat,
        minLon: validatedPayload.minLon,
        maxLat: validatedPayload.maxLat,
        maxLon: validatedPayload.maxLon,
      },
    })
    .then(responseContract(GetRoadsByBoundingBoxResponseDtoSchema))

  return mapGetRoadsByBoundingBox(response.data)
}
