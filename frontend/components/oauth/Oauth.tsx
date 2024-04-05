import { redirect } from 'next/navigation';

import Swal from 'sweetalert2';

import Token from './Token';
import { Login } from '@/apis/Auth';

interface IToken {
  nickname: string;
  id: number;
  survey_completion: boolean | null;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export default async function Oauth({
  code,
  provider,
}: {
  code: string;
  provider: string;
}) {
  let tokens: IToken = {
    nickname: '',
    id: 0,
    survey_completion: null,
    accessToken: '',
    refreshToken: '',
    accessTokenExpiresIn: 0,
    refreshTokenExpiresIn: 0,
  };
  let status = 0;
  try {
    const response = await Login({ code, provider: provider.toUpperCase() });
    status = response.status;

    if (response.status === 200) {
      const responseData = await response.json();
      const { data } = responseData;
      tokens = {
        nickname: data.nickname,
        id: data.id,
        survey_completion: data.survey_completion,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpiresIn: data.accessTokenExpiresIn,
        refreshTokenExpiresIn: data.refreshTokenExpiresIn,
      };
      if (data.survey_comletion === null) {
        Swal.fire({
          title: '정보 입력이 되지 않아 정보 입력 페이지로 이동합니다.',
          icon: 'warning',
        });
        redirect('/survey');
      }
      redirect('/');
    }
  } catch (error) {
    /* empty */
  }

  return <Token tokens={tokens} status={status} />;
}
