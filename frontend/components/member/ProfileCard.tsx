/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-comment-textnodes */
// eslint-disable-next-line camelcase, camelcase
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import './ProfileCard.scss';
import axios from 'axios';
import Image from 'next/image';
// eslint-disable-next-line import/order
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import BtnWithIcon from '../common/BtnWithIcon';
import authStore from '@/store/authStore';

interface ICard {
  nickname: string;
  birth_date: string;
  gender: string;
}

export default function ProfileCard({ nickname, birth_date, gender }: ICard) {
  const accessToken = authStore((state) => state.accessToken);
  const [info, setinfo] = useState({
    nickname: '',
    birth_date: '',
    gender: '',
  });

  useEffect(() => {
    setinfo({
      nickname,
      birth_date,
      gender,
    });
  }, [birth_date, gender, nickname]);

  const [onEdit, setOnEdit] = useState(false);

  const handleNicknameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setinfo({ ...info, nickname: e.target.value });
  };
  const handleBirthDateChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setinfo({ ...info, birth_date: e.target.value });
  };

  const EditInfo = () => {
    // eslint-disable-next-line no-use-before-define
    // eslint-disable-next-line no-use-before-define
    if (!validateNickname(info.nickname)) return;
    // eslint-disable-next-line no-use-before-define
    checkNickname();
  };

  const headerConfig = {
    headers: {
      Authorization: accessToken,
    },
  };
  // eslint-disable-next-line no-shadow
  const validateNickname = (nickname : string) => {
    if (nickname === '') {
      Swal.fire({
        title: '닉네임을 입력해주세요!',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
      });
      return false;
    }
    if (nickname.length > 20 || nickname.length < 3) {
      Swal.fire({
        title: '닉네임은 3자 이상 20자 이하\n로 입력해주세요!',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
      });
      return false;
    }
    if (/^[가-힣a-zA-Z0-9]+$/.test(nickname) === false) {
      Swal.fire({
        title: '특수문자/홀문자/공백은(는)\n사용이 불가능해요!',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
      });
      return false;
    }
    // eslint-disable-next-line consistent-return
    return true;
  };
  const checkNickname = async () => {
    if (validateNickname() === false) return;
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile/dupcheck`,
        {
          nickname: info.nickname,
        },
        headerConfig,
      )
      .then(() => {
        Swal.fire({
          title: `${info.nickname}는 사용가능한 닉네임 입니다`,
          icon: 'success',
          confirmButtonColor: '#ff7169',
        });
      })
      .catch(() => {
        Swal.fire({
          title: '사용할 수 없는 닉네임입니다',
          icon: 'warning',
          confirmButtonColor: '#ff7169',
        });
      });
  };
  return (
    <div className="card">
      <div className="info">
        <div className="wrapper">
          <div className="label">별명</div>
          {onEdit ? (
            <input className="nickname " value={info.nickname} onChange={handleNicknameChange} />
          ) : (
            <div className="nickname">{info.nickname}</div>
          )}
        </div>
        <div className="wrapper">
          <div className="label">생일</div>
          {onEdit ? (
            <input className="birth_date" value={info.birth_date} onChange={handleBirthDateChange}/>
          ) : (
            <div className="birth_date">{info.birth_date}</div>
          )}
        </div>
        <div className="wrapper">
          <div className="label">성별</div>
          <div className="gender">
            {info.gender === 'FEMALE' ? '여성' : '남성'}
          </div>
        </div>
      </div>
      <div className="below">
        {onEdit ? (
          <>
            <BtnWithIcon
              icon={SaveIcon}
              text="취소"
              btnStyle="empty-dark"
              handleOnClick={() => setOnEdit(false)}
            />
            <BtnWithIcon
              icon={SaveIcon}
              text="저장"
              btnStyle="empty-dark"
              handleOnClick={EditInfo}
            />
          </>
        ) : (
          <>
            <BtnWithIcon
              icon={EditIcon}
              text="수정"
              btnStyle="empty-light"
              handleOnClick={() => setOnEdit(true)}
            /><Image
              className="cocktail"
              src="../../../assets/imgs/cocktails.png"
              width={120}
              height={120}
              alt="noImage"
            />
          </>
        )}
      </div>
    </div>
  );
}
