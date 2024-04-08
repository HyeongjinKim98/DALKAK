'use client';

import { Suspense, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import styles from './refrigerator-recommend.module.scss';

import { ICocktailType } from '../../../type/searchTypes';
import { type } from '../../oauth/types';
import Loading from '@/components/common/Loading';
import RecommendList from '@/components/store/RecommendList';
import authStore from '@/store/authStore';

let zeroList: ICocktailType[] = [];
let nonZeroList: ICocktailType[] = [];

const getAccessToken = () => authStore.getState().accessToken;
const authorization = getAccessToken();

const getRecommentResult = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/recommends/refrigerator`,
    {
      headers: { authorization },
    },
  );
  const json = await res.json();
  return json.data;
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // 비동기 작업 수행
        const recommendList = await getRecommentResult();
        zeroList = await recommendList.zero;
        nonZeroList = await recommendList.non_zero;
        // 데이터 처리
        // ...
      } catch (error) {
        // 오류 처리
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
    setTimeout(() => {
      setLoading(false);
      setIsVisible(true);
    }, 3000);
    // fetchData 함수 호출
  }, []);

  return (
    <div>
      <Suspense
        fallback={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <Loading
            text1="가지고 있는 재료로 만들 수 있는"
            text2="최적의 칵테일을 추천해드릴게요!"
          />
        }
      >
        {loading ? (
          <Loading
            text1="가지고 있는 재료로 만들 수 있는"
            text2="최적의 칵테일을 추천해드릴게요!"
          />
        ) : (
          <>
            {isVisible && (
              <Confetti
                gravity={0.1}
                numberOfPieces={200}
                opacity={0.5}
                recycle={false}
                initialVelocityY={-10}
              />
            )}
            <RecommendList
              title="내가 가진 재료들로 만들 수 있는 칵테일이에요"
              cocktailList={zeroList}
            />
            <div className={styles['divide-line']} />
            <RecommendList
              title="재료가 좀 더 있으면 이런 것도 가능해요!"
              cocktailList={nonZeroList}
            />
          </>
        )}
      </Suspense>
    </div>
  );
}
