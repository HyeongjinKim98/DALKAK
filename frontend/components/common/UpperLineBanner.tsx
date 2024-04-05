'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './UpperLineBanner.module.scss';
import cocktails from '../../public/assets/imgs/cocktails.png';
import cocktails2 from '../../public/assets/imgs/cocktails2.png';
import fireworks from '../../public/assets/imgs/fireworks.png';

import BtnWithIcon from '@/components/common/BtnWithIcon';

interface Props {
  frontText: string | undefined;
  secondText: string;
  // eslint-disable-next-line react/require-default-props
  cocktailId?: number | null;
}

export default function UpperLineBanner({
  frontText,
  secondText,
  cocktailId,
}: Props) {
  const router = useRouter();

  const goToDetail = () => {
    router.push(`/cocktail/${cocktailId}`);
  };

  const goToWrite = () => {
    router.push(`/cocktail/write/?id=${cocktailId}`);
  };
  return (
    <div>
      {cocktailId ? (
        <div className={styles['banner-container']}>
          <div className={styles.text2}>
            <button
              type="button"
              onClick={goToDetail}
              className={styles['first-text']}
            >
              {frontText}
            </button>
            <span className={styles['second-text']}>&nbsp;{secondText}</span>
          </div>
          <div className={styles.my}>
            <BtnWithIcon
              text="나만의 커스텀 레시피 만들기"
              btnStyle="full-point"
              handleOnClick={goToWrite}
            />
          </div>
          <div className={styles.line}>
            <div className={styles.space}>
              <Image className={styles.img1} src={cocktails} alt="칵테일1" />

              <div className={styles.overlap}>
                <Image className={styles.img3} src={fireworks} alt="폭죽" />
                <Image className={styles.img2} src={cocktails2} alt="칵테일2" />
              </div>
            </div>
            <hr className={styles.divided} />
          </div>
        </div>
      ) : (
        <div>
          <div className={styles['banner-container2']}>
            <div className={styles.text}>
              <button
                type="button"
                onClick={() => {}}
                className={styles['first-text']}
              >
                {frontText}
              </button>
              <span className={styles['second-text']}>&nbsp;{secondText}</span>
            </div>
            <div className={styles.line}>
              <div className={styles.space}>
                <Image className={styles.img1} src={cocktails} alt="칵테일1" />

                <div className={styles.overlap}>
                  <Image className={styles.img3} src={fireworks} alt="폭죽" />
                  <Image
                    className={styles.img2}
                    src={cocktails2}
                    alt="칵테일2"
                  />
                </div>
              </div>
              <hr className={styles.divided} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
