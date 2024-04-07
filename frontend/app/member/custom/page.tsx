'use client';

import React, { useState, useEffect } from 'react';

import styles from '../../../components/cocktail-list/CocktailPagination.module.scss';
import CustomCocktailCard from '@/components/custom-cocktail/CustomCocktailCard';
import memberStore from '@/store/memberStore';
import './page.scss';
// eslint-disable-next-line import/order
import authStore from '@/store/authStore';
// eslint-disable-next-line import/order
import ReactPaginate from 'react-paginate';
// eslint-disable-next-line import/order
import Loading from '@/components/common/Loading';

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
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
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
        setMyCocktails(data.custom_cocktails);
        setTotalPage(data.total_page);
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
  }, [page]);

  const pagnate = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };
  if (loading) {
    if (loading) {
      return (
        <Loading text1="잠시만 기다려주세요!" text2="칵테일을 불러오는 중입니다." />
      );
    }
  }
  return (
    <div className="wrapper">
      <h2>{nickname} 님이 만든 커스텀 칵테일이에요!</h2>
      <div className="grid">
        {myCocktails?.map((cocktail: ICustom) => (
          <CustomCocktailCard
            key={cocktail.id}
            custom={cocktail}
            type="member"
          />
        ))}
      </div>
      <ReactPaginate
        breakLabel="..."
        previousLabel="<"
        nextLabel=">"
        forcePage={page - 1}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPage}
        onPageChange={pagnate}
        containerClassName={styles.pagination}
        pageClassName={styles['pagination-page']}
        previousClassName={styles['pagination-prev']}
        nextClassName={styles['pagination-next']}
        previousLinkClassName={styles['pagination-link']}
        nextLinkClassName={styles['pagination-link']}
        activeClassName={styles['pagination-link-active']}
      />
    </div>
  );
}
