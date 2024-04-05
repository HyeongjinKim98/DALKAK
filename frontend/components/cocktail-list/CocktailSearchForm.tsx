'use client';

import React, { ChangeEvent, useState } from 'react';
import {
  Search,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Replay,
} from '@mui/icons-material';
import styles from './CocktailSearchForm.module.scss';

import SearchBlock from './SearchBlock';
import SearchColor from './SearchColor';
import SearchAlcoholContent from '../common/AlcoholContent';
import BtnWithIcon from '../common/BtnWithIcon';
import IngredientBlock from '../common/IngredientBlock';
import IngredientSearchForm from '../common/IngredientSearchForm';
import useSearchStore from '@/store/searchStore';

const baseList = [
  {
    id: 1,
    name: '샴페인',
  },
  {
    id: 2,
    name: '럼',
  },
  {
    id: 3,
    name: '위스키',
  },
  {
    id: 4,
    name: '보드카',
  },
  {
    id: 5,
    name: '진',
  },
  {
    id: 6,
    name: '테킬라',
  },
  {
    id: 7,
    name: '브랜디',
  },
  {
    id: 8,
    name: '리큐어',
  },
  {
    id: 9,
    name: '와인',
  },
  {
    id: 10,
    name: '비터즈',
  },
];
const sweetnessList = [
  {
    id: 1,
    name: '매우 낮음',
  },
  {
    id: 2,
    name: '낮음',
  },
  {
    id: 3,
    name: '보통',
  },
  {
    id: 4,
    name: '높음',
  },
  {
    id: 5,
    name: '매우 높음',
  },
];

export default function CocktailSearchForm() {
  const {
    cocktailName,
    ingredients,
    base,
    minAlcohol,
    maxAlcohol,
    color,
    sweetness,
    setPage,
    setCocktailName,
    setBase,
    setMinAlcohol,
    setMaxAlcohol,
    setColor,
    setSweetness,
    setOrderBy,
    setActivateSearch,
    clearAll,
  } = useSearchStore();

  const [isVisible, setIsVisible] = useState(false);
  const handleCocktailName = (e: ChangeEvent<HTMLInputElement>) => {
    setCocktailName(e.target.value);
  };

  const handleAlcoholContent = (arr: readonly number[]) => {
    setMinAlcohol(arr[0]);
    setMaxAlcohol(arr[1]);
  };

  const handleOnClick = () => {
    setOrderBy(4);
    setPage(1);
    setActivateSearch();
  };

  return (
    <>
      <div className={styles['cocktailName-search-container']}>
        <input
          type="text"
          placeholder="어떤 칵테일을 찾으시나요?"
          name="cocktailName"
          value={cocktailName}
          onChange={(e) => handleCocktailName(e)}
        />
        <button
          type="submit"
          aria-label="Search Button"
          onClick={handleOnClick}
        >
          <Search />
        </button>
      </div>

      <div className={styles['detail-search-container']}>
        <button
          type="button"
          className={styles.header}
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <>
              상세 검색 접기
              <KeyboardArrowUp />
            </>
          ) : (
            <>
              상세 검색
              <KeyboardArrowDown />
            </>
          )}
        </button>
        {isVisible ? (
          <div className={styles.body}>
            <div className={styles.reset}>
              <BtnWithIcon
                icon={Replay}
                text="초기화"
                btnStyle="empty-light"
                handleOnClick={clearAll}
              />
            </div>
            <div className={`${styles.searchRow} ${ingredients}`}>
              <div className={styles.title}>재료</div>
              <div
                className={`${styles.content} ${styles['ingredients-container']}`}
              >
                <div className={styles['selected-container']}>
                  {ingredients?.map((ingredient) => (
                    // eslint-disable-next-line react/jsx-indent
                    <IngredientBlock
                      key={ingredient.id}
                      type="search"
                      ingredient={ingredient}
                    />
                    // eslint-disable-next-line indent
                  ))}
                </div>
                <IngredientSearchForm
                  placeholder="칵테일에 사용되는 재료를 검색해보세요!"
                  type="search"
                />
              </div>
            </div>
            <div className={`${styles.searchRow} ${styles.base}`}>
              <div className={styles.title}>베이스</div>
              <div className={styles.content}>
                <SearchBlock
                  list={baseList}
                  state={base}
                  handleState={setBase}
                />
              </div>
            </div>
            <div className={`${styles.searchRow} ${styles.alcoholContent}`}>
              <div className={styles.title}>도수</div>
              <div className={styles.content}>
                <SearchAlcoholContent
                  alcoholContent={[minAlcohol, maxAlcohol]}
                  handleAlcoholContent={handleAlcoholContent}
                />
              </div>
            </div>
            <div className={`${styles.searchRow} ${styles.color}`}>
              <div className={styles.title}>색상</div>
              <div className={styles.content}>
                <SearchColor color={color} handleState={setColor} />
              </div>
            </div>
            <div className={`${styles.searchRow} ${styles.sweetness}`}>
              <div className={styles.title}>당도</div>
              <div className={styles.content}>
                <SearchBlock
                  list={sweetnessList}
                  state={sweetness}
                  handleState={setSweetness}
                />
              </div>
            </div>
            <div className={styles.searchBtn}>
              <BtnWithIcon
                text="찾기"
                btnStyle="full-point"
                handleOnClick={handleOnClick}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
