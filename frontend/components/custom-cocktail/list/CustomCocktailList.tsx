/* eslint-disable no-nested-ternary */
/* eslint-disable indent */

'use client';

import React, { useState, useEffect, useCallback } from 'react';

import styles from './CustomCocktailList.module.scss';

import UpperLineBannerCustomList from '@/components/common/UpperLineBannerCustomList';
import CustomCocktailCardWrapper from '@/components/custom-cocktail/CustomCocktailCardWrapper';
import CustomCocktailPagination from '@/components/custom-cocktail/list/CustomCocktailPagination';
import authStore from '@/store/authStore';

interface User {
  id: number;
  nickname: string;
}

interface Custom_Cocktails {
  id: number;
  image: string;
  name: string;
  summary: string;
  user: User;
}

interface ApiResponse {
  cocktail_name: string;
  custom_cocktails: Custom_Cocktails[];
  current_page: number;
  total_page: number;
  total_elements: number;
}

const getAccessToken = () => authStore.getState().accessToken;
const authorization = getAccessToken();

interface Props {
  cocktailId: number;
}

export default function CustomCocktailList(props: Props) {
  const { cocktailId } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [customAllData, setCustomAllData] = useState<ApiResponse>();
  const [customList, setCustomList] = useState<Custom_Cocktails[]>([]);

  const getCustomList = useCallback(
    async (id: number) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customs/${id}/custom-list?page=${currentPage}`,
        {
          headers: {
            authorization,
          },
        },
      );

      if (!response.ok) {
        const error = new Error('Failed to fetch data');
        throw error;
      } else {
        const a = await response.json();
        const data = await a.data;
        return data;
      }
    },
    [currentPage],
  );

  const handlePageClick = async (e: { selected: number }) => {
    if (customList) {
      setCurrentPage(e.selected + 1);
    }
  };

  useEffect(() => {
    const updateCustomList = async () => {
      const response = await getCustomList(cocktailId);

      setCustomAllData(await response);
      setCustomList(await response.custom_cocktails);
    };
    updateCustomList();
  }, [currentPage, getCustomList, cocktailId]);

  return (
    <div>
      {/* <button type="button" onClick={confirm}>
        커스텀확인
      </button> */}
      <UpperLineBannerCustomList
        frontText={customAllData && customAllData.cocktail_name}
        secondText="를 활용한 다른 회원들의 색다른 레시피를 확인해보세요!"
        cocktailId={cocktailId}
      />
      {customAllData &&
      customAllData.custom_cocktails &&
      customAllData.custom_cocktails.length > 0 ? (
        <CustomCocktailCardWrapper dummy={customList} type="big" />
      ) : customAllData && customAllData.custom_cocktails.length < 1 ? (
        <div className={styles.empty}>등록된 커스텀 칵테일이 없습니다.</div>
      ) : null}
      {customAllData && customList.length > 0 ? (
        <CustomCocktailPagination
          totalPages={customAllData.total_page}
          handlePageClick={handlePageClick}
        />
      ) : null}
    </div>
  );
}
