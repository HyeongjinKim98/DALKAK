'use client';

import { useLayoutEffect, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import styles from './FoodArea.module.scss';
import IngredientBlock from '../common/IngredientBlock';
import useRefrigeratorStore from '@/store/refrigeratorStore';
import { IIngredientType } from '@/type/refrigeratorTypes';

export default function FoodArea() {
  const { refgList } = useRefrigeratorStore();

  const [foodList, setFoodList] = useState<IIngredientType[]>([]);

  useLayoutEffect(() => {
    const onlyFood =
      refgList?.length === 0
        ? []
        : refgList.filter((ingredient) => ingredient.category.id !== 1);
    setFoodList(onlyFood);
  }, [refgList]);

  return (
    <div className={styles.container}>
      <div className={styles['container-outer']}>
        <div className={styles['container-inner']}>
          <div className={styles.inside}>
            {foodList.map((ingredient: IIngredientType) => (
              <Draggable
                draggableId={ingredient.id.toString()}
                key={ingredient.id}
                index={ingredient.id}
              >
                {(draggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <IngredientBlock
                      key={ingredient.id}
                      type="refrigerator"
                      ingredient={ingredient}
                    />
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.hinges}>
        <div className={styles.hinge} />
        <div className={styles.hinge} />
      </div>
    </div>
  );
}
