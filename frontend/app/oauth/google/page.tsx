'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  // useState,
  useEffect,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ResponseData, AuthResponse } from '../types';
import Loading from '@/components/common/Loading';
import authStore from '@/store/authStore';
// import { Login } from '@/apis/Auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import memberStore from '@/store/memberStore';
import surveyStore from '@/store/surveyStore';

export default function Page() {
  const param = useSearchParams();
  // const [result, setResult] = useState({});
  const setTokens = authStore((state) => state.setTokens);
  const setInfo = memberStore((state) => state.setMemberStateLogin);

  useEffect(() => {
    if (param?.get('code')) {
      // eslint-disable-next-line no-use-before-define
      authorization(encodeURIComponent(param.get('code') as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  const authorization = async (authCode: string) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL as string}/oauth/login`, {
        code: authCode,
        provider: 'GOOGLE',
      })
      .then((response) => {
        const res = response.data as AuthResponse;
        const data = res.data as ResponseData;
        setTokens(data.accessToken, data.refreshToken, 0, 0);
        setInfo(data.id, data.nickname, data.survey_completion || false);

        if (memberStore.getState().nickname === null) {
          surveyStore.setState({ progress: 0 });
          window.location.href = '/survey';
        } else {
          window.location.href = '/';
        }
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <Loading text1="로그인 중입니다!" text2="조금만 기다려주세요!" />
  );
}
