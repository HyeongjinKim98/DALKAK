import React from 'react';
import Image from 'next/image';
import styles from './CustomCocktailImage.module.scss';

interface Props {
  customImage: string;
}

export default function CustomCocktailImage({ customImage }: Props) {
  return (
    <div className={styles.wrapper}>
      <Image
        src={customImage}
        alt="커스텀 칵테일 이미지"
        width={375}
        height={375}
      />
    </div>
  );
}
