package store.dalkak.api.custom.service;

import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import store.dalkak.api.cocktail.domain.Cocktail;
import store.dalkak.api.cocktail.domain.ingredient.Ingredient;
import store.dalkak.api.cocktail.domain.ingredient.Unit;
import store.dalkak.api.cocktail.dto.CocktailDto;
import store.dalkak.api.cocktail.exception.CocktailErrorCode;
import store.dalkak.api.cocktail.exception.CocktailException;
import store.dalkak.api.cocktail.repository.CocktailRepository;
import store.dalkak.api.cocktail.repository.UnitRepository;
import store.dalkak.api.cocktail.repository.ingredient.IngredientRepository;
import store.dalkak.api.custom.domain.Custom;
import store.dalkak.api.custom.domain.CustomIngredient;
import store.dalkak.api.custom.dto.CustomCocktailDto;
import store.dalkak.api.custom.dto.CustomIngredientDetailDto;
import store.dalkak.api.custom.dto.CustomIngredientDto;
import store.dalkak.api.custom.dto.CustomIngredientModifyDto;
import store.dalkak.api.custom.dto.CustomModifyDto;
import store.dalkak.api.custom.dto.request.CustomCreateReqDto;
import store.dalkak.api.custom.dto.response.CustomDetailResDto;
import store.dalkak.api.custom.dto.response.CustomListResDto;
import store.dalkak.api.custom.exception.CustomErrorCode;
import store.dalkak.api.custom.exception.CustomException;
import store.dalkak.api.custom.repository.CustomIngredientRepository;
import store.dalkak.api.custom.repository.CustomRepository;
import store.dalkak.api.global.config.ImageConfig;
import store.dalkak.api.user.domain.Member;
import store.dalkak.api.user.dto.MemberDto;
import store.dalkak.api.user.dto.UserDto;
import store.dalkak.api.user.exception.UserErrorCode;
import store.dalkak.api.user.exception.UserException;
import store.dalkak.api.user.repository.MemberRepository;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomServiceImpl implements CustomService {

    private final ImageConfig imageConfig;

    private final CocktailRepository cocktailRepository;

    private final UnitRepository unitRepository;

    private final IngredientRepository ingredientRepository;

    private final CustomRepository customRepository;

    private final CustomIngredientRepository customIngredientRepository;

    private final MemberRepository memberRepository;

    @Override
    public void createCustomCocktail(MultipartFile image, CustomCreateReqDto customCreateReqDto,
        MemberDto memberDto) {
        String imageUrl = imageConfig.uploadImage(image);
        Cocktail cocktail = cocktailRepository.findCocktailById(customCreateReqDto.getCocktailId());
        Member member = memberRepository.findMemberById(memberDto.getId());
        Custom custom = customRepository.save(Custom.builder().member(member).cocktail(cocktail)
            .name(customCreateReqDto.getCustomName()).comment(customCreateReqDto.getCustomComment())
            .recipe(customCreateReqDto.getCustomRecipe())
            .summary(customCreateReqDto.getCustomSummary()).open(customCreateReqDto.getOpen())
            .image(imageUrl).build());

        for (CustomIngredientDto customIngredientDto : customCreateReqDto.getCustomIngredientList()) {
            Unit unit = unitRepository.findUnitById(customIngredientDto.getUnitId());
            Ingredient ingredient = ingredientRepository.findIngredientById(
                customIngredientDto.getId());
            customIngredientRepository.save(CustomIngredient.builder().custom(custom)
                .amount(customIngredientDto.getAmount()).ingredient(ingredient).unit(unit)
                .build());
        }

    }

    @Override
    public void deleteCustomCocktail(Long userId, Long customCocktailId) {
        Custom custom = customRepository.findCustomById(customCocktailId);

        if(!Objects.equals(userId, custom.getMember().getId())) {
            throw new UserException(UserErrorCode.FORBIDDEN);
        }

        // 이미지 삭제
        imageConfig.deleteImage(custom.getImage());

        // 재료 삭제
        for (CustomIngredient customIngredient : custom.getCustomIngredients()) {
            customIngredientRepository.deleteCustomIngredientById(customIngredient.getId());
        }

        // 커스텀 칵테일 삭제
        customRepository.deleteCustomById(customCocktailId);
    }

    @Override
    public void modifyCustomCocktail(Long userId, Long customCocktailId, MultipartFile image,

        CustomCreateReqDto customCreateReqDto) {

        Custom custom = customRepository.findCustomById(customCocktailId);

        if(!Objects.equals(userId, custom.getMember().getId())) {
            throw new UserException(UserErrorCode.FORBIDDEN);
        }

        // 현재 커스텀 칵테일이 저장하고 있는 커스텀 재료 아이디를 리스트에 저장
        List<Long> customIngredientIdList = new ArrayList<>();
        for (CustomIngredient customIngredient : custom.getCustomIngredients()) {
            customIngredientIdList.add(customIngredient.getId());
        }

        // 현재 가지고 있는 아이디 리스트와 비교해서 만약 존재한다면 update, 존재하지 않는다면 save
        for (CustomIngredientDto customIngredientDto : customCreateReqDto.getCustomIngredientList()) {
            Unit unit = unitRepository.findUnitById(customIngredientDto.getUnitId());
            if (customIngredientIdList.contains(customIngredientDto.getId())) {
                customIngredientRepository.ModifyCustomIngredient(
                    new CustomIngredientModifyDto(customCocktailId, customIngredientDto.getAmount(),
                        unit));
            } else {
                Ingredient ingredient = ingredientRepository.findIngredientById(
                    customIngredientDto.getId());
                customIngredientRepository.save(
                    CustomIngredient.builder().unit(unit).ingredient(ingredient).custom(custom)
                        .build());
            }
        }

        String imageUrl;
        // 만약 이미지를 변경했다면
        if (image != null) {
            imageConfig.deleteImage(custom.getImage());
            imageUrl = imageConfig.uploadImage(image);
        } else {
            imageUrl = custom.getImage();
        }

        CustomModifyDto customModifyDto = new CustomModifyDto(customCreateReqDto.getCustomName(),
            customCreateReqDto.getCustomSummary(), customCreateReqDto.getCustomComment(),
            customCreateReqDto.getCustomRecipe(), imageUrl, customCreateReqDto.getOpen());

        customRepository.modifyCustomCocktail(customCocktailId, customModifyDto);
    }

    @Override
    public CustomListResDto getCustomList(Long cocktailId, Pageable page) {
        Cocktail targetcocktail = cocktailRepository.findById(cocktailId)
            .orElseThrow(() -> new CocktailException(
                CocktailErrorCode.FAIL_TO_FIND_COCKTAIL));
        Page<Custom> customPage = customRepository.findAllByCocktailOrderByIdDesc(targetcocktail,
            page);

        return CustomListResDto.builder()
            .customCocktails(toCustomCocktailDtoList(customPage.getContent()))
            .currentPage(customPage.getPageable().getPageNumber() + 1)
            .totalPage(customPage.getTotalPages())
            .totalElements((customPage.getTotalElements()))
            .build();
    }

    @Override
    public CustomDetailResDto findCustom(Long customCocktailId) {
        Custom targetCustom = customRepository.findById(customCocktailId).orElseThrow(
            () -> new CustomException(CustomErrorCode.FAIL_TO_FIND_CUSTOM));
        UserDto user = new UserDto(targetCustom.getMember().getId(),
            targetCustom.getMember().getNickname());
        CocktailDto cocktail = new CocktailDto(targetCustom.getCocktail().getId(),
            targetCustom.getCocktail().getName(), targetCustom.getCocktail().getKrName(),
            targetCustom.getCocktail().getImage(), targetCustom.getCocktail().getHeartCount());
        List<CustomIngredient> customIngredients = customIngredientRepository.findAllByCustom(
            targetCustom);
        List<CustomIngredientDetailDto> customIngredientDtoList = new ArrayList<>();
        for (CustomIngredient customIngredient : customIngredients) {
            customIngredientDtoList.add(new CustomIngredientDetailDto(
                customIngredient.getIngredient().getId(),
                customIngredient.getIngredient().getName(),
                customIngredient.getIngredient().getImage(),
                customIngredient.getAmount(),
                customIngredient.getUnit()));
        }

        return CustomDetailResDto.of(targetCustom, user, cocktail, customIngredientDtoList);
    }


    private List<CustomCocktailDto> toCustomCocktailDtoList(List<Custom> customs) {
        List<CustomCocktailDto> customCocktailDtoList = new ArrayList<>();
        for (Custom custom : customs) {
            customCocktailDtoList
                .add(CustomCocktailDto
                    .builder()
                    .id(custom.getId())
                    .image(custom.getCocktail().getImage())
                    .name(custom.getName())
                    .summary(custom.getSummary())
                    .user(UserDto.builder().id(custom.getMember().getId())
                        .nickname(custom.getMember().getNickname()).build())
                    .build());
        }
        return customCocktailDtoList;
    }
}
