import CustomCocktailWrite from '@/components/custom-cocktail/write/CustomCocktailWrite';
import { ICocktailType } from '@/type/searchTypes';

interface Props {
  cocktailId: string;
}

export default function Page({ params }: { params: Props }) {
  const { cocktailId } = params;
  return (
    <div>
      <CustomCocktailWrite cocktailId={cocktailId} />
    </div>
  );
}

export async function generateStaticParams() {
  const authorization =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2Nlc3MtdG9rZW4iLCJpYXQiOjE3MTEzMjkwNDUsImV4cCI6MTcxMTc2MTA0NSwiaWQiOjN9.zcY6r5AdHWBddd-sUz8oFdGV14DZLLyXi_5-BG--C20';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cocktails/search?page=${1}&orderBy=${3}`,
    {
      headers: { authorization },
      next: { tags: ['cocktailList'] },
    },
  );
  const json = await res.json();
  const initialPage = (await json).data.cocktails;
  return initialPage.map((cocktail: ICocktailType) => ({
    cocktailId: cocktail.id.toString(),
  }));
}
