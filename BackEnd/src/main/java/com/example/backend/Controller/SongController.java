package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.SongRequest;
import com.example.backend.DTO.Response.ArtistResponse;
import com.example.backend.DTO.Response.SongResponse;
import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @PostMapping
    public ApiResponse<SongResponse> createSong(@RequestBody SongRequest request) {
        return ApiResponse.<SongResponse>builder()
                .result(songService.createSong(request))
                .build();
    }

    // Get all songs (pagination)
    @GetMapping
    public ApiResponse<Page<SongSimpleResponse>> getAllSongs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<SongSimpleResponse>>builder()
                .result(songService.getAllSongs(PageRequest.of(page, size)))
                .build();
    }

    // Get song by ID
    @GetMapping("/{id}")
    public ApiResponse<SongResponse> getSongById(@PathVariable String id,
                                                 @RequestParam String userId) {
        return ApiResponse.<SongResponse>builder()
                .result(songService.getSongById(id, userId))
                .build();
    }


    // Delete song by ID
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
        return ApiResponse.<String>builder()
                .result("Song have been deleted")
                .build();
    }
}
