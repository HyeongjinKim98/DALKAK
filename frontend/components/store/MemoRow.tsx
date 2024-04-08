'use client';

import { Draggable } from '@hello-pangea/dnd';

import styles from './MemoRow.module.scss';
import { IIngredientType } from '@/type/refrigeratorTypes';

interface IPropsType {
  index: number;
  ingredient: IIngredientType;
  handleOnClick: (ingredient: number) => void;
}

export default function MemoRow(props: IPropsType) {
  const { ingredient, handleOnClick } = props;

  return (
    <div className={styles.container}>
      <Draggable
        draggableId={ingredient.id.toString()}
        key={600 + ingredient.id}
        index={ingredient.id}
      >
        {(provided) => (
          <div
            className={styles.name}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            role="button"
            tabIndex={0}
            onClick={() => handleOnClick(ingredient.id)}
            onKeyDown={() => handleOnClick(ingredient.id)}
          >
            {ingredient.name}
          </div>
        )}
      </Draggable>
    </div>
  );
}
