'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import styles from './NavbarTopRank.module.scss';

interface Top_Cocktails {
  cocktail_id: number;
  cocktail_korean_name: string;
}

const token = process.env.NEXT_PUBLIC_TOKEN;

export default function NavbarTopRank() {
  const router = useRouter();
  const [topCocktails, setTopCocktails] = useState<Top_Cocktails[]>([]);
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(1);
  const [currentCocktailId, setCurrentCocktailId] = useState(1);
  const [currentCocktailName, setCurrentCocktailName] = useState('');
  const [nextCocktailName, setNextCocktailName] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/recommends/heart-rank`, {
      headers: {
        Authorization: token ? `${token}` : '',
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
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const goToDetail = () => {
    if (currentCocktailId !== undefined) {
      router.push(`/cocktail/${currentCocktailId}`);
    }
  };

  const interval = setInterval(() => {
    console.log(firstIndex, secondIndex);
    setFirstIndex((prevIndex) => {
      const nextIndex = prevIndex + 1 > 9 ? 0 : prevIndex + 1;
      setCurrentCocktailId(topCocktails[nextIndex]?.cocktail_id);
      setCurrentCocktailName(topCocktails[nextIndex]?.cocktail_korean_name);
      return nextIndex;
    });

    setSecondIndex((prevIndex) => {
      const nextIndex = prevIndex + 1 > 9 ? 0 : prevIndex + 1;
      setNextCocktailName(topCocktails[nextIndex]?.cocktail_korean_name);
      return nextIndex;
    });
  }, 1510);

  setTimeout(() => {
    clearInterval(interval);
    console.log('Interval stopped.');
  }, 1510);

  // const currentCocktailName =
  //   topCocktails[firstIndex]?.cocktail_korean_name || '';
  // const first = '';
  // const firstCocktailName = topCocktails[0]?.cocktail_korean_name || '';
  // const current = `${firstIndex + 1}  ${currentCocktailName}`;
  // const nextCocktailName =
  // topCocktails[firstIndex + 1]?.cocktail_korean_name || '';
  // const next = `${firstIndex + 2}  ${nextCocktailName}`;

  // const current = `${currentCocktailName}`;
  // const next = `${nextCocktailName}`;

  return (
    <div>
      <div>
        <div className={styles.parent}>
          {firstIndex === 0 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              />
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>{firstIndex} &nbsp;</span>{' '}
                {currentCocktailName}
              </div>
            </div>
          )}

          {firstIndex !== 0 && firstIndex !== 9 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>{firstIndex} &nbsp;</span>{' '}
                {currentCocktailName}
              </div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>{secondIndex} &nbsp;</span>
                {nextCocktailName}
              </div>
            </div>
          )}
          {firstIndex === 9 && (
            <div>
              <div
                role="presentation"
                onClick={goToDetail}
                className={styles['slide-test']}
              >
                <span className={styles.point}>{firstIndex} &nbsp;</span>
                {currentCocktailName}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
