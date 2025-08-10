import { queryOptions } from '@tanstack/react-query';

import * as api from '../SWYP10BackendAPI';
import { queryKeyNamespaces } from './_namespaces';

const queryKeys = {
  festivalDetail: (festivalId: number) => [
    queryKeyNamespaces.festival,
    'detail',
    festivalId,
  ],
};

export const festivalDetail = (festivalId: number) =>
  queryOptions({
    queryKey: queryKeys.festivalDetail(festivalId),
    queryFn: () => api.getFestivalDetail(festivalId),
  });
