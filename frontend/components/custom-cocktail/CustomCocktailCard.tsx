'use client';

import React from 'react';

import Link from 'next/link';
// import { useRouter } from 'next/navigation';

import styles from './CustomCocktailCard.module.scss';

interface Custom_Cocktails {
  id: number;
  image: string;
  name: string;
  summary: string;
  user: {
    id: number;
    nickname: string;
  };
}

interface Props {
  custom: Custom_Cocktails;
  type: string;
}

export default function CustomCocktailCard({ custom, type }: Props) {
  const previewImageName =
    type === 'big' ? styles['custom-img'] : styles['custom-img-preview'];

  const previewTitleName =
    type === 'big' ? styles.title : styles['title-preview'];

  const previewCommentName =
    type === 'big' ? styles.comment : styles['comment-preview'];

  return (
    <Link href={{ pathname: `/cocktail/detail/${custom.id}` }}>
      <div className={styles['grid-item']}>
        <div className={styles['image-box']}>
          <img
            className={previewImageName}
            src={custom.image}
            alt={custom.name}
          />
          <div className={styles.author}>by {custom.user.nickname}</div>
        </div>
        <div className={previewTitleName}>{custom.name}</div>
        <div className={previewCommentName}>{custom.summary}</div>
      </div>
    </Link>
  );
}
