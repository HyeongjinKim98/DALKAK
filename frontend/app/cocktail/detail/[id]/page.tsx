'use client';

// import { useSearchParams } from 'next/navigation';

/* eslint-disable indent */
import CustomCocktailDetail from '@/components/custom-cocktail/detail/CustomCocktailDetail';

export default function Page({ params }: { params: { id: number } }) {
  // const searchParams = useSearchParams();
  // const customId = searchParams.get('id');
  // let customIdInt = 1;
  // if (customId) {
  //   customIdInt = parseInt(customId, 10);
  // console.log(params.id);
  // }

  return (
    <div>
      {/* <CustomCocktailDetail customId={customIdInt} /> */}
      <CustomCocktailDetail customId={params.id} />
    </div>
  );
}
