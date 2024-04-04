'use client';

import React, { useState, useEffect } from 'react';

import './main.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CocktailCard from '@/components/cocktail-list/CocktailCard';
import bartender from '@/public/assets/imgs/bartender.png';
import authStore from '@/store/authStore';
import memberStore from '@/store/memberStore';

interface ICocktailType {
  id: number;
  name: string;
  koreanName: string;
  image: string;
  heartCount: number;
}
export default function Page() {
  const isLoggedin = memberStore((state) => state.isLoggedIn);
  const [cocktails, setCocktails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userNickname, setUserNickname] = useState('');
  const itemsPerPage = 4;

  const router = useRouter();
  const getRecommendation = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/recommends/prefer`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authStore.getState().accessToken,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setCocktails(data.data.cocktails);
      } else {
        throw new Error('Recommendation fetch failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(cocktails.length / itemsPerPage);
  const currentPageData = cocktails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev % totalPages) + 1);
  };

  useEffect(() => {
    if (!isLoggedin) {
      window.location.href = '/oauth';
    }
    getRecommendation();
    setUserNickname(memberStore.getState().nickname);
  }, [isLoggedin]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      goToNextPage();
    }, 5000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  return (
    <div className="mainWrapper">
      <Image className="bartender" src={bartender} alt="bartender" width={80} />
      <div className="title-main">
        {userNickname}님이 좋아하실 만한 칵테일을 추천해봤어요
      </div>
      <div className="cocktail-list">
        <div className="cocktail-scroll">
          {currentPageData.map((cocktail: ICocktailType) => (
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
      {/* <button type="button" className="page-btn" onClick={goToPreviousPage}>
        prev
      </button>
      <button type="button" className="page-btn" onClick={goToNextPage}>
        next
      </button> */}
      <div className="subtitle-main">원하는 칵테일이 없으신가요?</div>
      <button
        className="cocktail-btn"
        type="button"
        // eslint-disable-next-line no-return-assign
        onClick={() => router.push('/cocktail')}
      >
        칵테일 찾기
      </button>
    </div>
  );
}
