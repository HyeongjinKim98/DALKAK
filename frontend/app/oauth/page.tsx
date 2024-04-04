import React from 'react';

import './main.scss';
import Image from 'next/image';
import OauthButton from '@/components/common/main/OauthButton';
import logo from '@/public/assets/imgs/dalkak_logo.png';

export default function page() {
  return (
    <div className="mainWrapper">
      <div className="flex">
        <Image src={logo} width={140} alt="Oops" />
      </div>
      <div className="subtitle-main">내가 원하는 칵테일을 찾아볼까요?</div>
      <div className="login-comment">SNS로 간편하게 로그인/회원가입 하기</div>
      <div className="oauth-buttons">
        <OauthButton
          provider="GOOGLE"
          bgcolor="google"
          icon="../assets/imgs/oauth/icon-google.svg"
        />
        <OauthButton
          provider="KAKAO"
          bgcolor="kakao"
          icon="../assets/imgs/oauth/icon-kakao.svg"
        />
        <OauthButton
          provider="NAVER"
          bgcolor="naver"
          icon="../assets/imgs/oauth/icon-naver.svg"
        />
      </div>
    </div>
  );
}
