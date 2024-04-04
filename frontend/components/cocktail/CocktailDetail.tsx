'use client';

import React from 'react';

import AddIcon from '@mui/icons-material/Add';

import Link from 'next/link';

import styles from './CocktailDetail.module.scss';
import CustomFour from './CustomFour';
import BtnWithIcon from '@/components/common/BtnWithIcon';

import LikeCount from '@/components/common/LikeCount';

import CustomCocktailImage from '@/components/custom-cocktail/CustomCocktailImage';
import CustomCocktailRecipe from '@/components/custom-cocktail/CustomCocktailRecipe';

import IngredientCardWrapper from '@/components/custom-cocktail/IngredientCardWrapper';
import ToolCardWrapper from '@/components/custom-cocktail/ToolCardWrapper';

interface Unit {
  id: number;
  name: string;
}

interface Cocktail_Ingredients {
  id: number;
  name: string;
  image: string;
  category_id: number;
  amount: number;
  unit: Unit;
}

interface Props {
  cocktailId: number;
}

const authorization =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2Nlc3MtdG9rZW4iLCJpYXQiOjE3MTIxOTc5OTksImV4cCI6MTcxMjYyOTk5OSwiaWQiOjZ9.w_9FzZor4EvYAWqZCvsi-fOkIvvwcD8jaWitynt12hI';

export async function getData({ cocktailId }: Props) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/${cocktailId}`,
    {
      headers: {
        authorization,
      },
    },
  );

  if (!response.ok) {
    // const error = new Error('Failed to fetch data');
    return 401;
  }
  const data = await response.json();
  return (await data).data;
}

export default async function CocktailDetail({ cocktailId }: Props) {
  const cocktailDetailData = await getData({ cocktailId });
  const cocktailIngredients: Cocktail_Ingredients[] =
    cocktailDetailData.cocktail_ingredients;
  // console.log(cocktailDetailData);

  return (
    <div className={styles['flex-container']}>
      <div className={styles.container}>
        <div className={styles['title-container']}>
          <div className={styles.left}>
            <div className={styles.name}>{cocktailDetailData.name}</div>

            <div className={styles.nickname}>
              <LikeCount />
              <div className={styles.info}>
                {cocktailDetailData.alcohol_content}도
              </div>
              <div className={styles.info}>
                당도{cocktailDetailData.sweetness}
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <Link
              href={{
                pathname: '/cocktail/write',
                query: { id: cocktailId },
              }}
            >
              <BtnWithIcon
                icon={AddIcon}
                text="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;커스텀 레시피 만들기"
                btnStyle="full-point"
              />
            </Link>
          </div>
        </div>

        <hr className={styles.hr} />
        <div className={styles['inner-container']}>
          <div className={styles.space}>
            <CustomCocktailImage customImage={cocktailDetailData.image} />
          </div>
          <div className={styles.space}>
            <IngredientCardWrapper ingredients={cocktailIngredients} />
            <ToolCardWrapper
              cocktailTools={cocktailDetailData.cocktail_tools}
            />
            <CustomCocktailRecipe recipe={cocktailDetailData.recipe} />
          </div>
        </div>

        <hr className={styles.hr2} />
        <div className={styles.flex}>
          <CustomFour />
        </div>
      </div>
      <div />
    </div>
  );
}
