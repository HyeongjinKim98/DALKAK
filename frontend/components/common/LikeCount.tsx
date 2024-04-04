/* eslint-disable no-nested-ternary */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import styles from './LikeCount.module.scss';

import emptyheart from '../../public/assets/imgs/emptyheart.png';
import heartImage from '../../public/assets/imgs/heartImage.png';
import authStore from '@/store/authStore';

export default function LikeCount() {
  const pathName = usePathname();
  const cocktailId = pathName.split('/')[2];
  const [isLike, setIsLike] = useState(false);
  const [count, setCount] = useState(0);

  const getAccessToken = () => authStore.getState().accessToken;
  const authorization = getAccessToken();

  const likeThisCocktail = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/${cocktailId}/like`,
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
      setIsLike(true);
      setCount((state) => state + 1);
    }
  };

  const dislikeThisCocktail = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/${cocktailId}/dislike`,
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
      setIsLike(false);
      setCount((state) => state - 1);
    }
  };

  const heart = async () => {
    try {
      if (isLike) {
        dislikeThisCocktail();
      } else {
        likeThisCocktail();
      }
    } catch (error) {
      console.error('Error');
    }
  };

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
        // console.log(result.data);
        setIsLike(result.data.heart);
        setCount(result.data.heart_count);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [authorization, cocktailId]);

  return (
    <div className={styles.flex}>
      <button type="button" onClick={heart}>
        {isLike ? (
          // eslint-disable-next-line react/jsx-no-undef
          <Image className={styles.hearts} src={heartImage} alt="하트" />
        ) : (
          <Image className={styles.hearts} src={emptyheart} alt="빈하트" />
        )}
      </button>
      <div>{count}</div>
    </div>
  );
}
