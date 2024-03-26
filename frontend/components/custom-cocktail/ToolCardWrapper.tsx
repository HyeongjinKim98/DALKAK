import React from 'react';
// import { StaticImageData } from 'next/image';
import styles from './IngredientCardWrapper.module.scss';
import ToolCard from './ToolCard';

interface CocktailTools {
  id: number;
  name: string;
  image: string;
}

interface Props {
  cocktailTools: CocktailTools[];
}

export default function ToolCardWrapper({ cocktailTools }: Props) {
  const lastIndex = cocktailTools.length - 1;

  // console.log('하하핳' + cocktailTools);

  return (
    <div>
      <div className={styles.flex}>
        <div className={styles.title}>도구</div>
      </div>
      <ul className={styles['grid-container']}>
        {cocktailTools && cocktailTools.length > 0 ? (
          cocktailTools.map((tool, index) => (
            <ToolCard
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              cocktailTool={tool}
              index={index}
              lastIndex={lastIndex}
            />
          ))
        ) : (
          <div>
            <div>필요한 도구 없음</div>
            <br />
          </div>
        )}
      </ul>
    </div>
  );
}
