import axios, { InternalAxiosRequestConfig } from 'axios';

import config from '@/config';

import { CommonResponse } from './CommonResponse';

export const attachAccessToken = async (config: InternalAxiosRequestConfig) => {
  // 로그인 이전
  if (config.url?.includes('/api/v1/auth/oauth/login/kakao')) {
    return config;
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  console.log('cookieStore:', cookieStore);
  const accessToken = cookieStore.get('accessToken')?.value;
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
    origin: config.base_url,
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
  // FIXME: 백엔드에서 문서화 오류가 있어 수동으로 처리
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
