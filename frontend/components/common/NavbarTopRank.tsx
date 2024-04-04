'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import styles from './NavbarTopRank.module.scss';
import authStore from '@/store/authStore';

interface Top_Cocktails {
  cocktail_id: number;
  cocktail_korean_name: string;
}

export default function NavbarTopRank() {
  const getAccessToken = () => authStore.getState().accessToken;
  const authorization = getAccessToken();

  const router = useRouter();
  const [topCocktails, setTopCocktails] = useState<Top_Cocktails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fetchComplete, setFetchComplete] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/recommends/heart-rank`, {
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
        setTopCocktails(result.data.heart_rank_list);
        setFetchComplete(true);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < 10) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setCurrentIndex(1);
      }
    }, 1500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const currentCocktailId = topCocktails[currentIndex + 1]?.cocktail_id;

  const goToDetail = () => {
    if (currentCocktailId !== undefined) {
      router.push(`/cocktail/${currentCocktailId}`);
    }
  };

  const first = '';

  return (
    <div>
      <div>
        <div className={styles.parent}>
          {fetchComplete === true && currentIndex === 0 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                {first}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>1 &nbsp;</span>
                {topCocktails[0].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 1 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                {/* <span className={styles.point}>{currentIndex} &nbsp;</span> */}
                <span className={styles.point}>1 &nbsp;</span>
                {topCocktails[0].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                {/* <span className={styles.point}>{secondIndex} &nbsp;</span> */}
                <span className={styles.point}>2 &nbsp;</span>
                {topCocktails[1].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 2 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>2 &nbsp;</span>
                {topCocktails[1].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>3 &nbsp;</span>
                {topCocktails[2].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 3 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>3 &nbsp;</span>
                {topCocktails[2].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>4 &nbsp;</span>
                {topCocktails[3].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 4 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>4 &nbsp;</span>
                {topCocktails[3].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>5 &nbsp;</span>
                {topCocktails[4].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 5 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>5 &nbsp;</span>
                {topCocktails[4].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>6 &nbsp;</span>
                {topCocktails[5].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 6 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>6 &nbsp;</span>
                {topCocktails[5].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>7 &nbsp;</span>
                {topCocktails[6].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 7 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>7 &nbsp;</span>
                {topCocktails[6].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>8 &nbsp;</span>
                {topCocktails[7].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 8 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>8 &nbsp;</span>
                {topCocktails[7].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>9 &nbsp;</span>
                {topCocktails[8].cocktail_korean_name}
              </div>
            </div>
          )}

          {fetchComplete === true && currentIndex === 9 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>9 &nbsp;</span>
                {topCocktails[8].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>10 &nbsp;</span>
                {topCocktails[9].cocktail_korean_name}
              </div>
            </div>
          )}

          {currentIndex === 10 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>10 &nbsp;</span>
                {topCocktails[9].cocktail_korean_name}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>1 &nbsp;</span>
                {topCocktails[0]?.cocktail_korean_name}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
