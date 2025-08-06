import { useQuery } from '@tanstack/react-query';

import { getTopKeywords } from '@/apis/SWYP10BackendAPI';

export function useTopKeywords(limit: number = 10) {
  return useQuery({
    queryKey: ['topKeywords', limit],
    queryFn: () => getTopKeywords({ limit }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
