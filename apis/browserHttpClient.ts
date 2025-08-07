import axios, { InternalAxiosRequestConfig } from 'axios';

import config from '@/config';

import { CommonResponse } from './CommonResponse';

export const attachAccessToken = async (config: InternalAxiosRequestConfig) => {
  const accessToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];
  console.log('accessToken found from cookie:', accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

const baseURL = config.api.baseURL;
const instance = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    // origin: config.base_url,
  },
});

instance.interceptors.request.use(attachAccessToken);

// 요청 로깅 인터셉터 추가
instance.interceptors.request.use(
  config => {
    console.log(' Request:', {
      method: config.method?.toUpperCase(),
      url: baseURL + (config.url ?? ''),
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// 응답 로깅 인터셉터 추가
instance.interceptors.response.use(
  response => {
    console.log('✅ Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  error => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    return Promise.reject(error);
  },
);

export const httpClient = async <T = unknown>({
  url,
  method,
  params,
  data,
  headers,
}: {
  url: string;
  method: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
}) => {
  const response = await instance({
    url,
    method,
    params,
    data,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return response.data as CommonResponse<T>;
};
