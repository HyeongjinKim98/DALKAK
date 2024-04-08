import Image from 'next/image';
import styles from './IngredientBlock.module.scss';
import useRefrigeratorStore from '@/store/refrigeratorStore';
import useSearchStore from '@/store/searchStore';
import surveyStore from '@/store/surveyStore';
import { IIngredientType } from '@/type/refrigeratorTypes';

interface ITagType {
  type: string;
  ingredient: IIngredientType;
}

export default function IngredientBlock(props: ITagType) {
  const { type, ingredient } = props;
  const { removeIngredient } = useSearchStore();
  const { removeRefrList } = useRefrigeratorStore();
  const { deleteSurveyIngredients } = surveyStore();
  const deleteIngredient = () => {
    if (type === 'search') {
      removeIngredient(ingredient);
    } else if (type === 'refrigerator') {
      removeRefrList(ingredient.id);
    } else if (type === 'survey') {
      deleteSurveyIngredients(ingredient);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={deleteIngredient}
      className={styles.container}
      onKeyDown={deleteIngredient}
    >
      <div className={styles['title-wrapper']}>{ingredient.name}</div>
      <div className={styles['image-wrapper']}>
        <Image
          src={ingredient.image}
          alt={ingredient.name}
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
