package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{songId}")
    public ApiResponse<String> addToFavorites(@PathVariable String songId) {
        favoriteService.addToFavorites(songId);
        return ApiResponse.<String>builder()
                .result("Song added to favorites")
                .build();
    }
    @DeleteMapping("/{songId}")
    public ApiResponse<String> removeFromFavorites(@PathVariable String songId) {
        favoriteService.removeFromFavorites(songId);
        return ApiResponse.<String>builder()
                .result("Removed song from favorite")
                .build();
    }

    @GetMapping
    public ApiResponse<Page<SongSimpleResponse>> getFavoriteSongs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("song.title").ascending());

        return ApiResponse.<Page<SongSimpleResponse>>builder()
                .result(favoriteService.getFavoriteSongs(pageable))
                .build();
    }


}
