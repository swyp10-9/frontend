import { useMemo, useRef, useState } from 'react';

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
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const lastQueryParamsRef = useRef<MapQueryParams | undefined>(null);

  const memoFestivals = useMemo(() => festivals, [festivals]);

  const loadFestivalsInBounds = async (
    bounds: MapBounds,
    queryParams?: MapQueryParams,
  ) => {
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

      setFestivals(() => festivalsWithFocus);
      console.log('축제 데이터 로드:', response.festivals.length);

      // 마지막으로 로드한 bounds와 queryParams 저장
      lastBoundsRef.current = bounds;
      lastQueryParamsRef.current = queryParams;
    } catch (error) {
      console.error('축제 데이터 로드 실패:', error);
    } finally {
      setIsLoadingFestivals(false);
      isLoadingRef.current = false;
    }
  };

  // queryParams가 변경되면 마지막 bounds로 데이터를 다시 로드
  const reloadWithCurrentQueryParams = () => {
    if (lastBoundsRef.current && lastQueryParamsRef.current) {
      loadFestivalsInBounds(lastBoundsRef.current, lastQueryParamsRef.current);
    }
  };

  const updateFestivalFocus = (festivalId: number) => {
    setFestivals(prevFestivals =>
      prevFestivals.map(f => ({
        ...f,
        isDetailed: f.id === festivalId,
      })),
    );
  };

  return {
    festivals: memoFestivals,
    isLoadingFestivals,
    loadFestivalsInBounds,
    reloadWithCurrentQueryParams,
    updateFestivalFocus,
  };
};
