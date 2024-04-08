'use client';

import { useSearchParams } from 'next/navigation';
import CustomCocktailWrite from '@/components/custom-cocktail/write/CustomCocktailWrite';

export default function Page() {
  const searchParams = useSearchParams();
  const cocktailId = searchParams.get('id');
  let cocktailIdInt = 1;
  if (cocktailId) {
    cocktailIdInt = parseInt(cocktailId, 10);
  }
  return (
    <div>
      <div>
        <CustomCocktailWrite cocktailId={cocktailIdInt} />
      </div>
    </div>
  );
}
