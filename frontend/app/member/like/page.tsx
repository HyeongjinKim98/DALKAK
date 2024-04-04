'use client';

import React, { useState, useEffect } from 'react';

import CocktailCard from '@/components/cocktail-list/CocktailCard';
import memberStore from '@/store/memberStore';
import './page.scss';
// eslint-disable-next-line import/order
import authStore from '@/store/authStore';
// eslint-disable-next-line import/order

interface ICocktailType {
  id: number;
  name: string;
  koreanName: string;
  image: string;
  heartCount: number;
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
        `${process.env.NEXT_PUBLIC_BASE_URL as string}/users/profile/heart-list?page=1`,
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
        setMyCocktails(data.cocktails);
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
      <h2>{nickname} 님이 좋아하시는 칵테일이에요!</h2>
      <div className="grid">
        {myCocktails?.map((cocktail: ICocktailType) => (
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
    </div>
  );
}
