// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

import Swal from 'sweetalert2';

import './InfoSurvey.scss';
import authStore from '@/store/authStore';
import surveyStore from '@/store/surveyStore';

// interface IMemberInfo {
//   nickname: string;
//   birth: string;
//   gender: string;
// }

export default function InfoSurvey() {
  const accessToken = authStore((state) => state.accessToken);
  const setNickname = surveyStore((state) => state.setNickname);
  const setbirthDate = surveyStore((state) => state.setBirthDate);
  const gender = surveyStore((state) => state.gender);
  const setGender = surveyStore((state) => state.setGender);

  const headerConfig = {
    headers: {
      Authorization: accessToken,
    },
  };
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);

  const setMemberInfoHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const { value } = e.target;
    switch (type) {
      case 'nickname':
        setNickname(value);
        break;
      case 'birth':
        setbirthDate(value);
        break;
      case 'gender':
        setGender(value);
        break;
      default:
        break;
    }
  };
  const checkNickname = async () => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile/dupcheck`,
        {
          nickname: surveyStore.getState().nickname,
        },
        headerConfig,
      )
      .then(() => {
        setIsNicknameChecked(true);
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
  const validateNickname = () => {
    const { nickname } = surveyStore.getState();
    if (nickname === '') {
      Swal.fire({
        title: '닉네임을 입력해주세요!',
        icon: 'warning',
      });
      return false;
    }
    if (nickname.length > 11 || nickname.length < 3) {
      Swal.fire({
        title: '닉네임은 3자 이상 10자 이하로 입력해주세요!',
        icon: 'warning',
      });
      return false;
    }
    if (/^[가-힣A-Za-z0-9]+$/.test(nickname)) {
      Swal.fire({
        title: '특수문자는 사용이 불가능해요!',
        icon: 'warning',
      });
      return false;
    }
    checkNickname();

    return isNicknameChecked;
  };

  // const isValidated = () => {
  //   const { birthDate } = surveyStore.getState;
  //   if (!/^\d{8}$/.test(birthDate)) return false;

  //   const year = parseInt(birthDate.substring(0, 4), 10);
  //   const month = parseInt(birthDate.substring(4, 6), 10) - 1;
  //   const day = parseInt(birthDate.substring(6, 8), 10);

  //   const newDate = new Date(year, month, day);
  //   if (
  //     newDate.getFullYear() !== year ||
  //     newDate.getMonth() !== month ||
  //     newDate.getDate() !== day
  //   ) {
  //     return false;
  //   }
  //   return true;
  // };
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
              validateNickname();
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
              className={`${gender === 'MALE' ? 'genderSelect-active' : ''}`}
              type="button"
              onClick={() => {
                setGender('MALE');
              }}
            >
              남
            </button>
            <button
              className={`${gender === 'FEMALE' ? 'genderSelect-active' : ''}`}
              type="button"
              onClick={() => {
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
