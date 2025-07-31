const config = {
  kakao: {
    // uri: process.env.NEXT_PUBLIC_KAKAO_URI,
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
    rest_api_key: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
  },
  naver: {
    map_client_id: process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID,
  },
};

export default config;
