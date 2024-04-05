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
import store.dalkak.api.custom.dto.CustomModifyDto;
import store.dalkak.api.custom.dto.request.CustomCreateReqDto;
import store.dalkak.api.custom.dto.request.CustomModifyReqDto;
import store.dalkak.api.custom.dto.response.CustomDetailResDto;
import store.dalkak.api.custom.dto.response.CustomIdListResDto;
import store.dalkak.api.custom.dto.response.CustomListResDto;
import store.dalkak.api.custom.exception.CustomErrorCode;
import store.dalkak.api.custom.exception.CustomException;
import store.dalkak.api.custom.repository.CustomIngredientRepository;
import store.dalkak.api.custom.repository.CustomRepository;
import store.dalkak.api.global.annotation.UserPermission;
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
    @UserPermission(userId = "userId", customCocktailId = "customCocktailId")
    public void deleteCustomCocktail(Long userId, Long customCocktailId) {

        // 기존에 가지고 있는 재료 삭제
        customIngredientRepository.deleteCustomIngredeintsByCustomId(customCocktailId);

        Custom custom = customRepository.findCustomById(customCocktailId);

        if (!Objects.equals(userId, custom.getMember().getId())) {
            throw new UserException(UserErrorCode.FORBIDDEN);
        }

        // 이미지 삭제
        imageConfig.deleteImage(custom.getImage());

        // 커스텀 칵테일 삭제
        customRepository.deleteCustomById(customCocktailId);
    }

    @Override
    @UserPermission(userId = "userId", customCocktailId = "customCocktailId")
    public void modifyCustomCocktail(Long userId, Long customCocktailId, MultipartFile image,
        CustomModifyReqDto customModifyReqDto) {

        // 기존에 가지고 있는 재료 삭제
        customIngredientRepository.deleteCustomIngredeintsByCustomId(customCocktailId);

        Custom custom = customRepository.findCustomById(customCocktailId);

        // 새로 들어온 재료 생성
        for (CustomIngredientDto customIngredientDto : customModifyReqDto.getCustomIngredientList()) {
            Unit unit = unitRepository.findUnitById(customIngredientDto.getUnitId());
            Ingredient ingredient = ingredientRepository.findIngredientById(
                customIngredientDto.getId());
            customIngredientRepository.save(CustomIngredient.builder().custom(custom)
                .amount(customIngredientDto.getAmount()).ingredient(ingredient).unit(unit)
                .build());
        }

        String imageUrl;
        // 만약 이미지를 변경했다면
        if (image != null) {
            imageConfig.deleteImage(custom.getImage());
            imageUrl = imageConfig.uploadImage(image);
        } else {
            imageUrl = custom.getImage();
        }

        CustomModifyDto customModifyDto = new CustomModifyDto(customModifyReqDto.getCustomName(),
            customModifyReqDto.getCustomSummary(), customModifyReqDto.getCustomComment(),
            customModifyReqDto.getCustomRecipe(), imageUrl, customModifyReqDto.getOpen());

        customRepository.modifyCustomCocktail(customCocktailId, customModifyDto);

    }

    @Override
    public CustomListResDto getCustomList(MemberDto memberDto, Long cocktailId, Pageable page) {
        Cocktail targetcocktail = cocktailRepository.findById(cocktailId)
            .orElseThrow(() -> new CocktailException(
                CocktailErrorCode.FAIL_TO_FIND_COCKTAIL));

        Page<Custom> customPage = customRepository.findAllCustom(
            memberDto,
            targetcocktail,
            page);

        return CustomListResDto.builder()
            .cocktailName(targetcocktail.getName())
            .customCocktails(toCustomCocktailDtoList(customPage.getContent()))
            .currentPage(customPage.getPageable().getPageNumber() + 1)
            .totalPage(customPage.getTotalPages())
            .totalElements((customPage.getTotalElements()))
            .build();
    }

    @Override
    public CustomDetailResDto findCustom(MemberDto memberDto, Long customCocktailId) {

        Custom targetCustom = customRepository.findById(customCocktailId).orElseThrow(
            () -> new CustomException(CustomErrorCode.FAIL_TO_FIND_CUSTOM));

        if (Boolean.FALSE.equals(targetCustom.getOpen()) && (!memberDto.getId()
            .equals(targetCustom.getMember().getId()))) {
            throw new CocktailException(CustomErrorCode.NOT_AVAILABLE);

        }

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

    @Override
    public CustomIdListResDto findAllCustomIdList() {
        return new CustomIdListResDto(
            customRepository.findAll().stream().map(Custom::getId).toList());
    }


    private List<CustomCocktailDto> toCustomCocktailDtoList(List<Custom> customs) {
        ArrayList<CustomCocktailDto> customCocktailDtoList = new ArrayList<>();
        for (Custom custom : customs) {
            customCocktailDtoList
                .add(CustomCocktailDto
                    .builder()
                    .id(custom.getId())
                    .image(custom.getImage())
                    .name(custom.getName())
                    .summary(custom.getSummary())
                    .user(UserDto.builder().id(custom.getMember().getId())
                        .nickname(custom.getMember().getNickname()).build())
                    .build());
        }
        return customCocktailDtoList;
    }
}
