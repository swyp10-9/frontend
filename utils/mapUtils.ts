import { DEFAULT_LOCATION } from '@/constants/mapConfig';
import type { LatLng, MapBounds } from '@/types/map';

export const getCurrentLocation = (): Promise<[number, number]> => {
  return new Promise(resolve => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log('위치 정보 가져오기 실패, 기본 위치 사용');
          resolve(DEFAULT_LOCATION);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } else {
      console.log('Geolocation 지원하지 않음, 기본 위치 사용');
      resolve(DEFAULT_LOCATION);
    }
  });
};

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

export const formatLatLngForURL = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
};

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
