import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { showCustomToast } from '@/components/CustomToast';

import * as api from '../SWYP10BackendAPI';
import { festivalDetail } from '../queries/festival';

export const useAddBookmark = (festivalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.addBookmark(festivalId),
    onSuccess: async () => {
      await queryClient.invalidateQueries(festivalDetail(festivalId));
      showCustomToast({
        message: '북마크에 추가되었습니다.',
        type: 'success',
      });
    },
    onError: async error => {
      if (error instanceof AxiosError) {
        showCustomToast({
          message: `오류가 발생했습니다 (${error.response?.data.message})`,
          type: 'error',
        });
      }
    },
  });
};
