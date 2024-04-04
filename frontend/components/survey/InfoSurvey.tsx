// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

import Swal from 'sweetalert2';

import './InfoSurvey.scss';
import authStore from '@/store/authStore';
import surveyStore from '@/store/surveyStore';

interface IMemberInfo {
  nickname: string;
  birth: string;
  gender: string;
}

export default function InfoSurvey() {
  const accessToken = authStore((state) => state.accessToken);
  const setNickname = surveyStore((state) => state.setNickname);
  const setbirthDate = surveyStore((state) => state.setBirthDate);
  const setGender = surveyStore((state) => state.setGender);
  const [selectedGender, setSelectedGender] = useState(
    surveyStore.getState().gender,
  );
  const headerConfig = {
    headers: {
      Authorization: accessToken,
    },
  };
  const [memberInfo, setMemberInfo] = useState<IMemberInfo>({
    nickname: '',
    birth: '',
    gender: '',
  });

  const setMemberInfoHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const { value } = e.target;
    switch (type) {
      case 'nickname':
        setMemberInfo({ ...memberInfo, nickname: value });
        setNickname(value);
        break;
      case 'birth':
        setMemberInfo({ ...memberInfo, birth: value });
        setbirthDate(value);
        break;
      case 'gender':
        setMemberInfo({ ...memberInfo, gender: value });
        setGender(value);
        break;
      default:
        break;
    }
  };

  const checkNickname = async () => {
    if (surveyStore.getState().nickname === '') {
      Swal.fire({
        title: '닉네임을 입력해주세요',
        icon: 'warning',
      });
      return;
    }
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile/dupcheck`,
        {
          nickname: surveyStore.getState().nickname,
        },
        headerConfig,
      )
      .then(() => {
        Swal.fire({
          title: '사용 가능한 닉네임입니다',
          icon: 'success',
        });
      })
      .catch(() => {
        Swal.fire({
          title: '중복된 닉네임입니다',
          icon: 'warning',
        });
      });
  };

  return (
    <div className="wrapper">
      <div className="input">
        <div className="nickname input-wrapper">
          <input
            placeholder="닉네임"
            onChange={(e) => {
              setMemberInfoHandler(e, 'nickname');
            }}
          />
          <button
            type="button"
            onClick={() => {
              checkNickname();
            }}
          >
            중복확인
          </button>
        </div>
        <hr />
        <div className="birth input-wrapper">
          <input
            placeholder="생일(YYYYMMDD)"
            onChange={(e) => {
              setMemberInfoHandler(e, 'birth');
            }}
          />
        </div>
        <hr />
        <div className="gender input-wrapper">
          <div>성별</div>
          <div className="genderSelect">
            <button
              className={`${selectedGender === 'MALE' ? 'genderSelect-active' : ''}`}
              type="button"
              onClick={() => {
                setSelectedGender('MALE');
                setGender('MALE');
              }}
            >
              남
            </button>
            <button
              className={`${selectedGender === 'FEMALE' ? 'genderSelect-active' : ''}`}
              type="button"
              onClick={() => {
                setSelectedGender('FEMALE');
                setGender('FEMALE');
              }}
            >
              여
            </button>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}
