// src/api/api.ts
// 서버용 Axios 인스턴스 (cookies() 사용)
import { httpClient as browserClient } from './browserHttpClient';

// 현재 환경이 서버인지 클라이언트인지 판단하는 함수
const isServer = typeof window === 'undefined';

// 실제 API 호출을 수행하는 함수
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
  if (isServer) {
    console.log('server');
    // 서버 환경에서는 동적 임포트 사용
    const { httpClient: serverClient } = await import('./serverHttpClient');

    return serverClient<T>({ url, method, params, data, headers });
  } else {
    // 클라이언트 환경에서는 정적 임포트 사용
    return browserClient<T>({ url, method, params, data, headers });
  }
};
