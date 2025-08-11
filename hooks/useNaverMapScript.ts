import { useRef } from 'react';

import config from '@/config';

export const useNaverMapScript = () => {
  const scriptLoadedRef = useRef(false);
  const clientId = config.naver.map_client_id;

  const loadScript = (onLoad: () => void) => {
    if (window.naver && window.naver.maps) {
      scriptLoadedRef.current = true;
      onLoad();
      return;
    }

    if (scriptLoadedRef.current) {
      onLoad();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;

    script.onload = () => {
      scriptLoadedRef.current = true;
      onLoad();
    };

    document.head.appendChild(script);
  };

  const isScriptLoaded = () => {
    return scriptLoadedRef.current && !!(window.naver && window.naver.maps);
  };

  return {
    loadScript,
    isScriptLoaded,
  };
};
