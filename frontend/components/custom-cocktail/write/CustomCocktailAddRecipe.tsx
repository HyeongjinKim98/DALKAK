'use client';

import React, { ChangeEvent } from 'react';

import styles from './CustomCocktailAddRecipe.module.scss';

interface Props {
  // recipe: string;
  inputValue: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  // splitedRecipe: string;
}

export default function CustomCocktailAddRecipe({
  // recipe,
  inputValue,
  // splitedRecipe,
  handleInputChange,
}: Props) {
  // const [inputValue, setInputValue] = useState(' ');

  // useEffect(() => {
  //   setInputValue(recipe);
  // }, [recipe]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setInputValue(e.target.value);
  // };

  // const splitedRecipe = (inputValue: string) =>
  //   inputValue.split('|').join('\n\n');
  // eslint-disable-next-line no-shadow
  const splitedRecipe = (inputValue: string) =>
    inputValue.split(/\|+/).join('\n\n');

  return (
    <div>
      <div className={styles.title}>레시피</div>
      <textarea
        value={splitedRecipe(inputValue)}
        className={styles['input-style']}
        onChange={handleInputChange}
      />
    </div>
  );
}
