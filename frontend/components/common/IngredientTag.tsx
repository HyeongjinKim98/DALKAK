import styles from './IngredientTag.module.scss';
import { IIngredientType } from '@/type/refrigeratorTypes';

interface ITagType {
  ingredient: IIngredientType;
  type: string;
  handleOnClick: (ingredient: IIngredientType | number) => void;
}

export default function IngredientTag(props: ITagType) {
  const { ingredient, type, handleOnClick } = props;

  return (
    <button
      type="button"
      onClick={
        type === 'search' || type === 'custom' || type === 'survey'
          ? () => handleOnClick(ingredient)
          : () => handleOnClick(ingredient.id)
      }
      className={styles.container}
    >
      {ingredient.name}
    </button>
  );
}
