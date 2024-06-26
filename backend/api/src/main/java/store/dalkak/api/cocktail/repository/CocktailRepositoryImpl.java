package store.dalkak.api.cocktail.repository;

import static store.dalkak.api.cocktail.domain.QCocktail.cocktail;
import static store.dalkak.api.cocktail.domain.base.QBase.base;
import static store.dalkak.api.cocktail.domain.base.QCocktailBase.cocktailBase;
import static store.dalkak.api.cocktail.domain.ingredient.QCocktailIngredient.cocktailIngredient;
import static store.dalkak.api.cocktail.domain.ingredient.QIngredient.ingredient;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import store.dalkak.api.cocktail.dto.CocktailDto;


@Transactional(readOnly = true)
@RequiredArgsConstructor
@Repository
public class CocktailRepositoryImpl implements CocktailRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    private OrderSpecifier<?> orderByCondition(Integer orderBy) {
        if (orderBy == null) {
            return cocktail.heartCount.desc(); // 기본 정렬: 하트 수 내림차순
        }

        return switch (orderBy) {
            case 1 -> cocktail.name.asc(); // 이름 오름차순
            case 2 -> cocktail.name.desc(); // 이름 내림차순
            case 3 -> cocktail.heartCount.asc(); // 하트 수 오름차순
            case 4 -> cocktail.heartCount.desc(); // 하트 수 내림차순
            default -> cocktail.heartCount.desc(); // 기본값 4
        };
    }

    private BooleanExpression nameFilter(String cocktailName) {
        return cocktailName != null ? cocktail.name.contains(cocktailName)
            .or(cocktail.krName.contains(cocktailName)) : null;
    }


    private BooleanExpression ingredientFilter(List<Long> ingredients) {
        if (ingredients == null || ingredients.isEmpty()) {
            return null;
        }
        // 재료 개수를 세어, 주어진 재료 리스트의 크기와 같은지 비교
        return JPAExpressions
            .select(cocktailIngredient.ingredient.id.countDistinct())
            .from(cocktailIngredient)
            .where(cocktailIngredient.cocktail.id.eq(cocktail.id)
                .and(cocktailIngredient.ingredient.id.in(ingredients)))
            .groupBy(cocktailIngredient.cocktail.id)
            .having(cocktailIngredient.ingredient.id.countDistinct()
                .eq(Long.valueOf(ingredients.size())))
            .exists();
    }

    private BooleanExpression baseFilter(Long baseDrink) {
        return baseDrink != null ? base.id.eq(baseDrink) : null;
    }

    private BooleanExpression alcoholFilter(Integer min, Integer max) {
        return min != null && max != null ? cocktail.alcohol.between(min, max) : null;
    }

    private BooleanExpression colorFilter(Long cocktailColor) {
        return cocktailColor != null ? cocktail.color.id.eq(cocktailColor) : null;
    }

    private BooleanExpression sweetnessFilter(Integer sweetness) {
        return sweetness != null ? cocktail.sweetness.eq(sweetness) : null;
    }

    public Page<CocktailDto> findCocktailsByOption(Pageable page, String cocktailName,
        List<Long> ingredients, Long baseDrink, Integer minAlcoholContent,
        Integer maxAlcoholContent, Long cocktailColor,
        Integer sweetness, Integer orderBy) {

        OrderSpecifier<?> orderSpecifier = orderByCondition(orderBy);

        List<Long> distinctCocktailIds = queryFactory
            .select(cocktail.id)
            .from(cocktail)
            .leftJoin(cocktail.cocktailBases, cocktailBase)
            .leftJoin(cocktailBase.base, base)
            .leftJoin(cocktail.cocktailIngredients, cocktailIngredient)
            .leftJoin(cocktailIngredient.ingredient, ingredient)
            .where(
                nameFilter(cocktailName),
                ingredientFilter(ingredients),
                baseFilter(baseDrink),
                alcoholFilter(minAlcoholContent, maxAlcoholContent),
                colorFilter(cocktailColor),
                sweetnessFilter(sweetness)
            )
            .groupBy(cocktail.id)
            .fetch();

        List<CocktailDto> cocktailDtoQueryResults = queryFactory
            .select(Projections.constructor(
                CocktailDto.class,
                cocktail.id,
                cocktail.name,
                cocktail.krName,
                cocktail.image,
                cocktail.heartCount))
            .from(cocktail)
            .where(cocktail.id.in(distinctCocktailIds))
            .offset(page.getOffset())
            .limit(page.getPageSize())
            .orderBy(orderSpecifier)
            .fetch();

        long total = distinctCocktailIds.size();

        return new PageImpl<>(cocktailDtoQueryResults, page, total);

    }

    @Override
    public void modifyHeartCount(Long cocktailId, int count) {
        queryFactory.update(cocktail).set(cocktail.heartCount, count)
            .where(cocktail.id.eq(cocktailId)).execute();
    }

    @Override
    public void modifyViewCount(Long cocktailId, int count) {
        queryFactory.update(cocktail).set(cocktail.viewCount, count)
            .where(cocktail.id.eq(cocktailId)).execute();
    }

}
