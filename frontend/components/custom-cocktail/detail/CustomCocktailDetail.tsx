/* eslint-disable no-nested-ternary */
import React from 'react';

import styles from './CustomCocktailDetail.module.scss';

import CustomCocktailDetailButtonArea from './CustomCocktailDetailButtonArea';
import IngredientCardWrapper from '../IngredientCardWrapper';
// import CustomCocktailDeleteButton from '@/components/custom-cocktail/CustomCocktailDeleteButton';
import CustomCocktailImage from '@/components/custom-cocktail/CustomCocktailImage';
import CustomCocktailInfo from '@/components/custom-cocktail/CustomCocktailInfo';
// import CustomCocktailModifyButton from '@/components/custom-cocktail/CustomCocktailModifyButton';
import CustomCocktailRecipe from '@/components/custom-cocktail/CustomCocktailRecipe';
import authStore from '@/store/authStore';

interface Custom_Ingredients {
  ingredient: {
    id: number;
    name: string;
    image: string;
  };
  ingredient_amount: number;
  unit: {
    id: number;
    name: string;
  };
}

interface Origin_Cocktail {
  id: number;
  name: string;
  korean_name: string;
  image: string;
  heart_count: number;
}

interface Data {
  custom_ingredients: Custom_Ingredients[];
  user: {
    id: number;
    nickname: string;
  };
  origin_cocktail: Origin_Cocktail;
  id: number;
  name: string;
  image: string;
  recipe: string;
  summary: string;
  comment: string;
  open: boolean;
}

interface ApiResponse {
  code: number;
  messages: string[];
  data: Data;
}

interface Props {
  customId: number;
}

const getAccessToken = () => authStore.getState().accessToken;
const authorization = getAccessToken();

export async function getData({ customId }: Props) {
  // console.log(customId);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customs/${customId}`,
    {
      headers: {
        authorization,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      return 403;
    }
    return 404;
  }
  const data: ApiResponse = await response.json();
  // console.log(data);
  // console.log(data.data.recipe);
  return data.data;
}
export default async function CustomCocktailDetail({ customId }: Props) {
  const customCocktailDetailData = await getData({ customId });

  let customIngredients: Custom_Ingredients[] = [];
  let originCocktail: Origin_Cocktail = {
    id: 0,
    name: '',
    korean_name: '',
    image: '',
    heart_count: 0,
  };
  let originCocktailNames: string = '';

  if (customCocktailDetailData !== 403 && customCocktailDetailData !== 404) {
    customIngredients = customCocktailDetailData.custom_ingredients;
    originCocktail = customCocktailDetailData?.origin_cocktail;
    originCocktailNames = `${originCocktail?.name}, ${originCocktail?.korean_name}`;
  }

  return customCocktailDetailData === 403 ? (
    <div>접근 권한이 없습니다</div>
  ) : customCocktailDetailData === 404 ? (
    <div>게시글을 불러올 수 없습니다</div>
  ) : (
    <div className={styles['flex-container']}>
      <div className={styles.container}>
        <div className={styles['title-container']}>
          <div className={styles.names}>
            <div className={styles.name}>{customCocktailDetailData.name}</div>
            <div className={styles.nickname}>
              by&nbsp;{customCocktailDetailData.user.nickname}
            </div>
          </div>
          <div />
          <div>
            <CustomCocktailDetailButtonArea
              customId={customId}
              originId={originCocktail.id}
              authorId={customCocktailDetailData.user.id}
            />
          </div>
        </div>

        <hr className={styles.hr} />
        <div className={styles['inner-container']}>
          <div className={styles.space}>
            <CustomCocktailImage customImage={customCocktailDetailData.image} />
            <div className={styles['info-container']}>
              <CustomCocktailInfo cocktail={originCocktailNames} />
              <CustomCocktailInfo summary={customCocktailDetailData.summary} />
              <CustomCocktailInfo comment={customCocktailDetailData.comment} />
            </div>
          </div>
          <div className={styles.space}>
            <IngredientCardWrapper ingredients={customIngredients} />
            <CustomCocktailRecipe recipe={customCocktailDetailData.recipe} />
          </div>
        </div>
      </div>
    </div>
  );
}
