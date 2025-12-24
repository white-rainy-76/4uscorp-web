import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { GetTollRoadsByBoundingBoxPayload } from '../model/types/roads.payload'
import { GetTollRoadsByBoundingBoxResponse } from '../model/types/roads'
import { GetTollRoadsByBoundingBoxPayloadSchema } from './payload/toll-roads.payload'

import { GetTollRoadsByBoundingBoxResponseDtoSchema } from './contracts/toll-roads.dto.contract'
import { mapGetTollRoadsByBoundingBox } from './mapper/toll-roads.mapper'
import { useAuthStore } from '@/shared/store/auth-store'

export const getTollRoadsByBoundingBox = async (
  payload: GetTollRoadsByBoundingBoxPayload,
  signal?: AbortSignal,
): Promise<GetTollRoadsByBoundingBoxResponse> => {
  const validatedPayload = GetTollRoadsByBoundingBoxPayloadSchema.parse(payload)
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
    .then(responseContract(GetTollRoadsByBoundingBoxResponseDtoSchema))

  return mapGetTollRoadsByBoundingBox(response.data)
}
