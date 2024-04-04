'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './CustomFour.module.scss';
import BtnWithIcon from '../common/BtnWithIcon';
import NoContent from '../common/NoContent';
import CustomCocktailCard from '../custom-cocktail/CustomCocktailCard';
import authStore from '@/store/authStore';

interface ICustomCocktail {
  id: number;
  image: string;
  name: string;
  summary: string;
  user: {
    id: number;
    nickname: string;
  };
}

export default function CustomFour() {
  const pathName = usePathname();
  const cocktailId = pathName.split('/')[2];

  const [customList, setCustomList] = useState<ICustomCocktail[]>([]);

  const getAccessToken = () => authStore.getState().accessToken;
  const authorization = getAccessToken();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/${cocktailId}`, {
      headers: {
        authorization,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((result) => {
        setCustomList(result.data.custom_cocktails);
      })
      .catch((error) => {
        throw error;
      });
  }, [authorization, cocktailId]);

  const router = useRouter();
  return (
    <div className={styles.container}>
      {customList.length === 0 ? (
        <>
          <div className={styles.title}>커스텀 칵테일</div>
          <NoContent
            title="이런!"
            line1="아직 등록된 커스텀 칵테일이 없네요"
            line2="제일 먼저 등록해볼까요?"
          />
        </>
      ) : (
        <div className={styles.flexContainer}>
          <div className={styles.title}>
            커스텀 칵테일
            <BtnWithIcon
              text="전체 보기"
              btnStyle="full-point"
              handleOnClick={() => {
                router.push(`/cocktail/customs?id=${cocktailId}`);
              }}
            />
          </div>
          <div className={styles.content}>
            {customList?.map((item) => (
              <CustomCocktailCard key={item.id} custom={item} type="small" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
