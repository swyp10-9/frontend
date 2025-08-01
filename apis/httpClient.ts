import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://175.45.195.169:8080',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const httpClient = async <T = any>({
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
}): Promise<T> => {
  const response = await instance({
    url,
    method,
    params,
    data,
    headers,
  });

  return response.data;
};
