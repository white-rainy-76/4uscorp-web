import { api } from '@/shared/api'
import { responseContract } from '@/shared/api'
import { AxiosRequestConfig } from 'axios'
import { authResponseSchema } from './contracts/auth.contract'
import {
  signInPayloadSchema,
  signUpPayloadSchema,
} from './payload/auth.payload'
import { AuthResponse } from '../model'
import { SignInPayload, SignUpPayload } from '../model'

export const signIn = async (
  payload: SignInPayload,
  signal?: AbortSignal,
): Promise<AuthResponse> => {
  const validatedPayload = signInPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(`/auth-api/Auth/login`, validatedPayload, config)
    .then(responseContract(authResponseSchema))

  return response.data
}

export const signUp = async (
  payload: SignUpPayload,
  signal?: AbortSignal,
): Promise<AuthResponse> => {
  const validatedPayload = signInPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(`/auth-api/Auth/Register`, validatedPayload, config)
    .then(responseContract(authResponseSchema))

  return response.data
}

export const logout = async (signal?: AbortSignal): Promise<void> => {
  const config: AxiosRequestConfig = { signal }
  await api.post(`/auth-api/Auth/logout`, {}, config)
}
