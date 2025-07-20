'use client'

import config from "@/config"

export default function LoginButton({ type }:{ type: 'kakao' | 'naver' | 'not-login' }) {
    const kakaoUri = config.kakao.redirect_uri
    const kakaoRestApiKey = config.kakao.rest_api_key
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestApiKey}&redirect_uri=${kakaoUri}&response_type=code`
    
    return (
        <div>
            {type === 'not-login' && (
                <a>로그인 없이 볼게요</a>
            )}
            {type === 'kakao' && (
                <a href={kakaoUrl}>10초만에 카카오로 시작하기</a>
            )}
            {type === 'naver' && (
                <a>10초만에 네이버로 시작하기</a>
            )}
        </div>
    )
}