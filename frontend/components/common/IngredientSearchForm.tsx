'use client';

import { ChangeEvent, useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import styles from './IngredientSearchForm.module.scss';
import IngredientTag from './IngredientTag';
import authStore from '@/store/authStore';
import useRefrigeratorStore from '@/store/refrigeratorStore';
import useSearchStore from '@/store/searchStore';
import surveyStore from '@/store/surveyStore';
import { IIngredientType } from '@/type/refrigeratorTypes';

interface IPropsType {
  placeholder: string;
  type: string;
  // eslint-disable-next-line react/require-default-props
  addTempList?: (id: number, name: string) => void | undefined;
}

export default function IngredientSearchForm(props: IPropsType) {
  const { placeholder, type, addTempList } = props;
  const [keyword, setKeyword] = useState('');
  const [resultList, setResultList] = useState([]);
  const { addRefrList, addMemoList } = useRefrigeratorStore();
  const { addIngredient } = useSearchStore();
  const { addSurveyIngredients } = surveyStore();

  const getAccessToken = () => authStore.getState().accessToken;
  const authorization = getAccessToken();

  // const getIngredientList = async (k: string) => {
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/ingredients?ingredient-name='${k}'`,
  //   {
  //     headers: { authorization },
  //   },
  // );
  // const json = await res.json();
  // return (await json).data;
  // };

  const getList = useCallback(
    async (k: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/ingredients?ingredient-name='${k}'`,
        {
          headers: { authorization },
        },
      );
      const json = await res.json();
      setResultList((await json).data);
    },
    [authorization],
  );

  const debouncedGetList = useMemo(
    () => debounce((k: string) => getList(k), 700),
    [getList],
  );

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    debouncedGetList(e.target.value);
  };

  const handleOnClick = (ingredient: IIngredientType | number) => {
    if (type === 'search' && typeof ingredient !== 'number') {
      addIngredient(ingredient);
    } else if (type === 'refrigerator' && typeof ingredient === 'number') {
      addRefrList(ingredient);
    } else if (type === 'memo' && typeof ingredient === 'number') {
      addMemoList(ingredient);
    } else if (
      type === 'custom' &&
      addTempList &&
      typeof ingredient !== 'number'
    ) {
      addTempList(ingredient.id, ingredient.name);
    } else if (type === 'survey' && typeof ingredient !== 'number') {
      addSurveyIngredients(ingredient);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={keyword}
        onChange={onChangeKeyword}
        placeholder={placeholder}
      />
      {resultList ? (
        <div className={styles['results-container']}>
          {resultList.map((ingredient: IIngredientType) => (
            <IngredientTag
              key={ingredient.id}
              ingredient={ingredient}
              type={type}
              handleOnClick={handleOnClick}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
