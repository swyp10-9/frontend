import { useCallback, useRef, useState } from 'react';

import { getFestivalsForMap } from '@/apis/SWYP10BackendAPI';
import type {
  FestivalMapRequestPeriod,
  FestivalMapRequestStatus,
  FestivalMapRequestTheme,
  FestivalMapRequestWithWhom,
} from '@/apis/SWYP10BackendAPI.schemas';
import type {
  Festival,
  FestivalResponse,
  MapBounds,
  MapQueryParams,
} from '@/types/map';

const fetchFestivalsInBounds = async (
  bounds: MapBounds,
  queryParams?: MapQueryParams,
): Promise<FestivalResponse> => {
  try {
    const response = await getFestivalsForMap({
      page: 0,
      size: 100,
      sort: 'createdAt,desc',
      status: (queryParams?.status as FestivalMapRequestStatus) || 'ALL',
      period: (queryParams?.period as FestivalMapRequestPeriod) || 'ALL',
      withWhom: (queryParams?.withWhom as FestivalMapRequestWithWhom) || 'ALL',
      theme: (queryParams?.theme as FestivalMapRequestTheme) || 'ALL',
      latTopLeft: bounds.nw.lat,
      lngTopLeft: bounds.nw.lng,
      latBottomRight: bounds.se.lat,
      lngBottomRight: bounds.se.lng,
    });

    const content = response?.data.content || [];
    // @ts-expect-error 잘못된 타입 사용
    const festivals: Festival[] = [...(content || [])].map(festival => ({
      id: festival.id,
      title: festival.title,
      theme: festival.theme,
      image: festival.thumbnail,
      loc: festival.address,
      start_date: festival.startDate,
      end_date: festival.endDate,
      is_marked: festival.bookmarked,
      map_x: festival.map_x,
      map_y: festival.map_y,
    }));

    return {
      festivals,
      total: response?.data?.totalElements || 0,
    };
  } catch (error) {
    console.error('축제 데이터 로드 실패:', error);
    return {
      festivals: [],
      total: 0,
    };
  }
};

export const useFestivalData = (focusFestivalId?: number) => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(false);
  const isLoadingRef = useRef(false);

  const loadFestivalsInBounds = useCallback(
    async (bounds: MapBounds, queryParams?: MapQueryParams) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoadingFestivals(true);

      try {
        const response = await fetchFestivalsInBounds(bounds, queryParams);

        const festivalsWithFocus =
          typeof focusFestivalId === 'number'
            ? response.festivals.map(f => ({
                ...f,
                isDetailed: f.id === focusFestivalId,
              }))
            : response.festivals;

        setFestivals(festivalsWithFocus);
        console.log('축제 데이터 로드:', response.festivals.length);
      } catch (error) {
        console.error('축제 데이터 로드 실패:', error);
      } finally {
        setIsLoadingFestivals(false);
        isLoadingRef.current = false;
      }
    },
    [focusFestivalId],
  );

  const updateFestivalFocus = useCallback((festivalId: number) => {
    setFestivals(prevFestivals =>
      prevFestivals.map(f => ({
        ...f,
        isDetailed: f.id === festivalId,
      })),
    );
  }, []);

  return {
    festivals,
    isLoadingFestivals,
    loadFestivalsInBounds,
    updateFestivalFocus,
  };
};
