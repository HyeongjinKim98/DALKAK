'use client';

import { ChangeEvent } from 'react';

import styles from './CustomCocktailAddIngredient.module.scss';

// import IngredientBlock from '@/components/common/IngredientBlock';
import IngredientSearchForm from '@/components/common/IngredientSearchForm';

interface Unit {
  id: number;
  name: string;
}

interface CustomIngredientList {
  id: number;
  name: string;
  image: string;
  category_id: number;
  amount?: number;
  ingredient_amount?: number;
  unit: Unit;
}

type RemoveItemFunction = (id: number) => void;

// type AddItemFunction = (id: number, name: string) => void;

interface Props {
  removeItem: RemoveItemFunction;
  // eslint-disable-next-line react/require-default-props
  // addItem?: AddItemFunction;
  handleInputChangeTest: (value: number, index: number) => void;
  handleUnitInputChange: (
    e: ChangeEvent<HTMLSelectElement>,
    id: number,
    unitId: number,
  ) => void;
  tempList: CustomIngredientList[];
  // inputValues: number[];
  // inputUnitValues: string[];
  // inputUnitValuesId: number[];
  addTempList: (id: number, name: string) => void;
}

export default function CustomCocktailAddIngredientTest({
  removeItem,
  handleInputChangeTest,
  handleUnitInputChange,
  tempList,
  addTempList,
  // addItem,
}: Props) {
  return (
    <div>
      <div className={styles.title}>재료</div>

      <div className={styles.scrollable}>
        <div className={styles.add}>
          {tempList.map((data, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <div className={styles['grid-container']}>
                <div>{data.name}</div>
                <div />
                <div>
                  <input
                    type="number"
                    pattern="[0-9]+"
                    className={styles['amount-input']}
                    // defaultValue={tempList[index].amount}
                    value={data.amount ? data.amount : data.ingredient_amount}
                    maxLength={4}
                    onChange={
                      (e) =>
                        handleInputChangeTest(
                          parseInt(e.target.value, 10),
                          tempList[index].id,
                        )
                      // eslint-disable-next-line react/jsx-curly-newline
                    }
                  />
                </div>
                <div>
                  <select
                    className={styles['unit-input']}
                    // defaultValue={tempList[index].unit.id}
                    value={data.unit.id}
                    onChange={
                      (e) =>
                        handleUnitInputChange(
                          e,
                          parseInt(e.target.value, 10),
                          tempList[index].id,
                        )
                      // eslint-disable-next-line react/jsx-curly-newline
                    }
                  >
                    <option value="1">개</option>
                    <option value="2">웨지</option>
                    <option value="3">슬라이스</option>
                    <option value="4">꼬집</option>
                    <option value="5">조각</option>
                    <option value="6">ml</option>
                    <option value="7">스쿱</option>
                    <option value="8">방울</option>
                    <option value="9">그램</option>
                    <option value="10">잎</option>
                    <option value="11">none</option>
                  </select>
                </div>
                <div />
                <div>
                  <button
                    type="button"
                    className={styles['delete-button']}
                    onClick={() => removeItem(data.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.searchRow} ${styles.ingredients}`}>
        <div className={styles.title} />
        <div className={styles['ingredients-container']}>
          <IngredientSearchForm
            placeholder="칵테일에 사용되는 재료를 검색해보세요!"
            type="custom"
            // handleOnClick={() => {}}
            addTempList={addTempList}
          />
        </div>
      </div>
    </div>
  );
}
