/* eslint-disable react/prop-types */

'use client';

import React from 'react';

import { Favorite } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CocktailCard.module.scss';
import authStore from '@/store/authStore';
import memberStore from '@/store/memberStore';

interface ICocktailType {
  id: number;
  name: string;
  koreanName: string;
  image: string;
  heartCount: number;
}

export default function CocktailCard(props: ICocktailType) {
  const { id, name, koreanName, image, heartCount } = props;

  const getAccessToken = () => authStore.getState().accessToken;
  const authorization = getAccessToken();
  const createLog = () => {
    memberStore
      .getState()
      .setVisited({ id, name, koreanName, image, heartCount });
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/${id}/log`, {
      headers: { authorization },
    });
  };

  return (
    <Link href={`/cocktail/${id}/`}>
      <button type="button" className={styles.container} onClick={createLog}>
        <div className={styles.image}>
          <Image
            src={image}
            alt={name}
            width={500}
            height={500}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP89B8AAukB8/71MdcAAAAASUVORK5CYII="
          />
        </div>
        <div className={styles.title}>
          <div className={styles.name}>
            <h1 className={styles.eng}>{name}</h1>
            <h3 className={styles.kor}>{koreanName}</h3>
          </div>
          <div className={styles.like}>
            <Favorite />
            {heartCount}
          </div>
        </div>
      </button>
    </Link>
  );
}
