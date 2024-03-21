package store.dalkak.api.custom.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import store.dalkak.api.custom.dto.request.CustomCreateReqDto;
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

    // 로그인한 Member 추가
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createCustomCocktail(
        @RequestPart("image") MultipartFile image,
        @RequestPart("CustomCreateReqDto") CustomCreateReqDto customCreateReqDto,
        @LoginUser MemberDto memberDto) {
        customService.createCustomCocktail(image, customCreateReqDto, memberDto);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.of(201, "커스텀 칵테일이 생성되었습니다."));
    }

    @PatchMapping("/{customCocktailId}")
    public ResponseEntity<ApiResponse<String>> modifyCustomCocktail(@PathVariable("customCocktailId") Long customCocktailId, @RequestPart("image") MultipartFile image,
        @RequestPart("CustomCreateReqDto") CustomCreateReqDto customCreateReqDto) {
        customService.modifyCustomCocktail(customCocktailId, image, customCreateReqDto);
        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.of(201, "커스텀 칵테일이 수정되었습니다."));
    }

    @DeleteMapping("/{customCocktailId}")
    public ResponseEntity<ApiResponse<String>> deleteCustomCocktail(@PathVariable("customCocktailId") Long customCocktailId) {
        customService.deleteCustomCocktail(customCocktailId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(200, "커스텀 칵테일이 삭제되었습니다."));
    }
}