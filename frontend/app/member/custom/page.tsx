'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import CustomCocktailCard from '@/components/custom-cocktail/CustomCocktailCard';
import memberStore from '@/store/memberStore';
import './page.scss';
// eslint-disable-next-line import/order
import authStore from '@/store/authStore';
// eslint-disable-next-line import/order

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
export default function Page() {
  const nickname = memberStore((state) => state.nickname);
  const [myCocktails, setMyCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const getAccessToken = () => authStore.getState().accessToken;
  const loadCocktails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL as string}/users/profile/custom-recipe-list?page=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAccessToken(),
          },
        },
      );

      if (response.status === 200) {
        const responseData = await response.json();
        const { data } = responseData;
        console.log(data);
        setMyCocktails(data.custom_cocktails);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCocktails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }
  return (
    <div className="wrapper">
      <h2>{nickname} 님이 만든 커스텀 칵테일이에요!</h2>
      <div className="grid">
        {myCocktails?.map((cocktail: ICustom) => (
          <CustomCocktailCard key={cocktail.id} custom={cocktail} type="big" />
        ))}
      </div>
    </div>
  );
}
