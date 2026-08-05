import axios from 'axios'
import { storage } from '@/lib/storage'
import type {
  ClientKeysResponse,
  CreateClientKeyRequest,
  CreateClientKeyResponse,
  RevealClientKeyResponse,
  UpdateClientKeyRequest,
  SuccessResponse,
} from '@/types/api'

const api = axios.create({
  baseURL: '/api/admin',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const apiKey = storage.getApiKey()
  if (apiKey) config.headers['x-api-key'] = apiKey
  return config
})

export async function listClientKeys(): Promise<ClientKeysResponse> {
  const { data } = await api.get<ClientKeysResponse>('/client-keys')
  return data
}

export async function createClientKey(
  req: CreateClientKeyRequest,
): Promise<CreateClientKeyResponse> {
  const { data } = await api.post<CreateClientKeyResponse>('/client-keys', req)
  return data
}

export async function deleteClientKey(id: number): Promise<SuccessResponse> {
  const { data } = await api.delete<SuccessResponse>(`/client-keys/${id}`)
  return data
}

export async function updateClientKey(
  id: number,
  req: UpdateClientKeyRequest,
): Promise<SuccessResponse> {
  const { data } = await api.put<SuccessResponse>(`/client-keys/${id}`, req)
  return data
}

export async function setClientKeyDisabled(
  id: number,
  disabled: boolean,
): Promise<SuccessResponse> {
  const { data } = await api.post<SuccessResponse>(`/client-keys/${id}/disabled`, { disabled })
  return data
}

export async function resetClientKeyStats(id: number): Promise<SuccessResponse> {
  const { data } = await api.post<SuccessResponse>(`/client-keys/${id}/reset-stats`)
  return data
}

export async function rotateClientKey(id: number): Promise<CreateClientKeyResponse> {
  const { data } = await api.post<CreateClientKeyResponse>(`/client-keys/${id}/rotate`)
  return data
}

/**
 * 拉取指定 Key 的明文，用于「复制明文」与「查看明文」。
 *
 * 明文不随列表返回，只在用户主动触发时按 id 请求一次，避免列表轮询反复携带敏感值。
 */
export async function revealClientKey(id: number): Promise<RevealClientKeyResponse> {
  const { data } = await api.get<RevealClientKeyResponse>(`/client-keys/${id}/plaintext`)
  return data
}
