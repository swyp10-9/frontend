import { DEFAULT_LOCATION } from '@/constants/mapConfig';
import type { LatLng, MapBounds } from '@/types/map';

// Geolocation 옵션 상수
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<[number, number]> => {
  return new Promise(resolve => {
    if (!navigator?.geolocation) {
      console.log('Geolocation 지원하지 않음, 기본 위치 사용');
      resolve(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        console.log('위치 정보 가져오기 실패, 기본 위치 사용');
        resolve(DEFAULT_LOCATION);
      },
      GEOLOCATION_OPTIONS,
    );
  });
};

// 지도 경계 데이터 생성
export const createMapBounds = (bounds: naver.maps.LatLngBounds): MapBounds => {
  const sw = bounds.getMin();
  const ne = bounds.getMax();
  const nw = new window.naver.maps.LatLng(ne.y, sw.x);
  const se = new window.naver.maps.LatLng(sw.y, ne.x);

  return {
    sw: { lat: sw.y, lng: sw.x },
    ne: { lat: ne.y, lng: ne.x },
    nw: { lat: nw.lat(), lng: nw.lng() },
    se: { lat: se.lat(), lng: se.lng() },
  };
};

// URL에서 좌표 파싱
export const parseLatLngFromURL = (
  lat: string | null,
  lng: string | null,
): LatLng | null => {
  if (!lat || !lng) return null;

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) return null;

  return { lat: latNum, lng: lngNum };
};

// URL용 좌표 포맷팅
export const formatLatLngForURL = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
};

// 디바운스 유틸리티
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 좌표 간 거리 계산 (미터 단위)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// 좌표가 경계 내에 있는지 확인
export const isCoordinateInBounds = (
  lat: number,
  lng: number,
  bounds: MapBounds,
): boolean => {
  return (
    lat >= bounds.sw.lat &&
    lat <= bounds.ne.lat &&
    lng >= bounds.sw.lng &&
    lng <= bounds.ne.lng
  );
};
