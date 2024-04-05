package store.dalkak.api.custom.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import store.dalkak.api.custom.dto.request.CustomCreateReqDto;
import store.dalkak.api.custom.dto.request.CustomModifyReqDto;
import store.dalkak.api.custom.dto.response.CustomDetailResDto;
import store.dalkak.api.custom.dto.response.CustomIdListResDto;
import store.dalkak.api.custom.dto.response.CustomListResDto;
import store.dalkak.api.custom.service.CustomService;
import store.dalkak.api.global.annotation.LoginUser;
import store.dalkak.api.global.response.ApiResponse;
import store.dalkak.api.user.dto.MemberDto;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customs")
@Slf4j
public class CustomController {

    private final CustomService customService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createCustomCocktail(
        @RequestPart(value = "image") MultipartFile image,
        @RequestPart("CustomCreateReqDto") CustomCreateReqDto customCreateReqDto,
        @LoginUser MemberDto memberDto) {
        customService.createCustomCocktail(image, customCreateReqDto, memberDto);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.of(201, "커스텀 칵테일이 생성되었습니다."));
    }

    @PatchMapping("/{customCocktailId}")
    public ResponseEntity<ApiResponse<String>> modifyCustomCocktail(
        @LoginUser MemberDto memberDto,
        @PathVariable("customCocktailId") Long customCocktailId,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @RequestPart("CustomModifyReqDto") CustomModifyReqDto customModifyReqDto) {
        customService.modifyCustomCocktail(memberDto.getId(), customCocktailId, image,
            customModifyReqDto);
        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.of(201, "커스텀 칵테일이 수정되었습니다."));
    }

    @DeleteMapping("/{customCocktailId}")
    public ResponseEntity<ApiResponse<String>> deleteCustomCocktail(
        @LoginUser MemberDto memberDto,
        @PathVariable("customCocktailId") Long customCocktailId) {
        customService.deleteCustomCocktail(memberDto.getId(), customCocktailId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(200, "커스텀 칵테일이 삭제되었습니다."));
    }

    @GetMapping("/{customCocktailId}")
    public ResponseEntity<ApiResponse<CustomDetailResDto>> customDetail(
        @LoginUser MemberDto memberDto,
        @PathVariable("customCocktailId") Long customCocktailId) {
        CustomDetailResDto custom = customService.findCustom(memberDto, customCocktailId);

        ApiResponse<CustomDetailResDto> apiResponse = ApiResponse.of(200,
            custom);

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/{cocktailId}/custom-list")
    public ResponseEntity<ApiResponse<CustomListResDto>> customCocktailList(
        @LoginUser MemberDto memberDto,
        @PathVariable("cocktailId") Long cocktailId,
        @PageableDefault(value = 20) Pageable page
    ) {
        CustomListResDto customListResDto = customService.getCustomList(memberDto, cocktailId,
            page);

        ApiResponse<CustomListResDto> apiResponse = ApiResponse.of(200, customListResDto);

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/custom-list")
    public ResponseEntity<ApiResponse<CustomIdListResDto>> customCocktailIdList() {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.of(200, customService.findAllCustomIdList()));
    }
}
