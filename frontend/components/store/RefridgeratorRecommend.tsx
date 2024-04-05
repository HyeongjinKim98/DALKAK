'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './RefridgeratorRecommend.module.scss';
import fireworks from '@/public/assets/imgs/fireworks.png';
import recommendTools from '@/public/assets/imgs/recommendTools.png';

export default function RefridgeratorRecommend() {
  return (
    <Link href="/storage/recommend" prefetch={false}>
      <div className={styles.container}>
        <div className={styles['image-wrapper']}>
          <Image
            src={fireworks}
            width={1000}
            alt="냉장고 추천 hover"
            className={styles.firework}
          />
          <Image
            src={recommendTools}
            width={1000}
            alt="냉장고 추천 이미지"
            className={styles.tools}
          />
        </div>
        <div className={styles['text-container']}>
          <h3 className={styles.title}>이 재료로</h3>
          <h3 className={styles.title}>추천 받기</h3>
          <div className={styles['color-block']} />
        </div>
      </div>
    </Link>
  );
}
