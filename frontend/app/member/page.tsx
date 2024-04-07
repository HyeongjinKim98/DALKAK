/* eslint-disable react/jsx-key */

'use client';

import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';

import { getProfile } from '@/apis/Member';
import CocktailCard from '@/components/cocktail-list/CocktailCard';
import BtnWithIcon from '@/components/common/BtnWithIcon';
import CustomCocktailCard from '@/components/custom-cocktail/CustomCocktailCard';
import ProfileCard from '@/components/member/ProfileCard';
import memberStore from '@/store/memberStore';
import NoContent from '@/components/common/NoContent';

import './page.scss';

interface IData {
  id: number;
  nickname: string;
  birth_date: number[];
  gender: string;
  heart_cocktails: number[];
  custom_cocktails: number[];
}
interface ICustom {
  id: number;
  image: string;
  name: string;
  summary: string;
  user: {
    id: number;
    nickname: string;
  };
}
interface ICocktailType {
  id: number;
  name: string;
  koreanName: string;
  image: string;
  heartCount: number;
}
const convertBirthdateToString = (birth: number[]) =>
  `${birth[0]}.${birth[1].toString().padStart(2, '0')}.${birth[2].toString().padStart(2, '0')}`;
export default function Page() {
  const [profile, setProfile] = useState({} as IData);
  const [loading, setLoading] = useState(true);
  const [myCocktails, setMyCocktails] = useState([] as ICocktailType[]);
  const [customCocktails, setCustomCocktails] = useState([] as ICustom[]);
  const visitedCocktails = memberStore((state) => state.visited);
  const setMyLikeCocktails = memberStore((state) => state.setMyCocktails);
  const setMyCustomCocktails = memberStore((state) => state.setCustomCocktails);
  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      if (response.status === 200) {
        const responseData = await response.json();
        const { data } = responseData;
        setMyCocktails(data.heart_cocktails);
        setCustomCocktails(data.custom_cocktails);
        setMyLikeCocktails(data.heart_cocktails);
        setMyCustomCocktails(data.custom_cocktails);
        setProfile(data);
      } else if (response.status === 401) {
        Swal.fire({
          title: '로그인이 필요합니다',
          icon: 'warning',
          confirmButtonColor: '#ff7169',
        });
        window.location.replace('/oauth');
      }
    } catch (e) {
      Swal.fire({
        title: '프로필을 불러오는데 실패하였습니다.',
        icon: 'warning',
        confirmButtonColor: '#ff7169',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="column-box">
      <div className="container with-profile">
        {profile && (
          <ProfileCard
            nickname={profile.nickname}
            // birth_date={profile.birth_date}
            birth_date={convertBirthdateToString(profile.birth_date)}
            gender={profile.gender}
          />
        )}
        <div className="container">
          <h3 className="title">최근 조회한 칵테일</h3>
          <div className="list-wrapper visited">
            {visitedCocktails.slice(0, 3).map((cocktail) => (
              <CocktailCard
                key={cocktail.id}
                id={cocktail.id}
                name={cocktail.name}
                koreanName={cocktail.koreanName}
                image={cocktail.image}
                heartCount={cocktail.heartCount}
              />
            ))}
          </div>
          {visitedCocktails.length === 0 && (
            <div className="no-content-like">
              <NoContent
                title="Oops!"
                line1="아직 아무 칵테일도 조회하지 않았군요"
                line2="지금 달칵의 다양한 칵테일을 즐겨보세요!"
              />
            </div>
          )}
        </div>
      </div>
      <div className="mypage-cocktail">
        <hr />
        <div className="container">
          <div className="title-with-btn">
            <h3>좋아요 누른 칵테일</h3>
            <BtnWithIcon
              text="전체보기"
              btnStyle="full-point"
              handleOnClick={() => {
                window.location.href = '/member/like';
              }}
            />
          </div>
          <div className="list-wrapper">
            {myCocktails?.map((cocktail) => (
              <CocktailCard
                key={cocktail.id}
                id={cocktail.id}
                name={cocktail.name}
                koreanName={cocktail.koreanName}
                image={cocktail.image}
                heartCount={cocktail.heartCount}
              />
            ))}
            {myCocktails.length === 0 && (
              <div className="no-content-like">
                <NoContent
                  title="Oops!"
                  line1="아직 좋아하는 칵테일이 없어요.."
                  line2="마음에 드는 칵테일의 좋아요를 눌러보세요!"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mypage-cocktail">
        <hr />
        <div className="container">
          <div className="title-with-btn">
            <h3>커스텀 칵테일</h3>
            <BtnWithIcon
              text="전체보기"
              btnStyle="full-point"
              handleOnClick={() => {
                window.location.href = '/member/custom';
              }}
            />
          </div>
          <div className="list-wrapper">
            {customCocktails.map((cocktail) => (
              <CustomCocktailCard
                key={cocktail.id}
                custom={cocktail}
                type="member"
              />
            ))}
            {customCocktails.length === 0 && (
              <NoContent
                title="Oops!"
                line1="ㅇㅅㅇ? 아직 커스텀 칵테일이 없어요.."
                line2="당신만의 커스텀 칵테일을 공유해주세요!"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
