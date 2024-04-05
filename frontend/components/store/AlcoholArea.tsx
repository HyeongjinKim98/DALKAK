'use client';

import { useLayoutEffect, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import styles from './AlcoholArea.module.scss';
import IngredientBlock from '../common/IngredientBlock';
import useRefrigeratorStore from '@/store/refrigeratorStore';
import { IIngredientType } from '@/type/refrigeratorTypes';

export default function AlcoholArea() {
  const { refgList } = useRefrigeratorStore();

  const [alcoholList, setAlcoholList] = useState<IIngredientType[]>([]);

  useLayoutEffect(() => {
    const onlyAlcohol =
      refgList?.length === 0
        ? []
        : refgList.filter((ingredient) => ingredient.category.id === 1);
    setAlcoholList(onlyAlcohol);
  }, [refgList]);

  return (
    <div className={styles['container-outer']}>
      <div className={styles['container-inner']}>
        <div className={styles.inside}>
          {alcoholList.map((ingredient: IIngredientType) => (
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
  );
}
