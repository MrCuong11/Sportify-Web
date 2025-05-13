package com.example.backend.Controller;

import com.example.backend.DTO.Request.AlbumRequest;
import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Response.AlbumBriefResponse;
import com.example.backend.DTO.Response.AlbumResponse;
import com.example.backend.Service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @PostMapping
    public ApiResponse<AlbumResponse> createAlbum(@RequestBody AlbumRequest request) {
        AlbumResponse response = albumService.createAlbum(request);
        return ApiResponse.<AlbumResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<AlbumResponse> getAlbum(@PathVariable String id) {
        AlbumResponse response = albumService.getAlbum(id);
        return ApiResponse.<AlbumResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping
    public ApiResponse<Page<AlbumBriefResponse>> getAllAlbums(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AlbumBriefResponse> response = albumService.getAllAlbums(pageable);
        return ApiResponse.<Page<AlbumBriefResponse>>builder()
                .result(response)
                .build();
    }


    @PutMapping("/{id}")
    public ApiResponse<AlbumResponse> updateAlbum(@PathVariable String id, @RequestBody AlbumRequest request) {
        AlbumResponse response = albumService.updateAlbum(id, request);
        return ApiResponse.<AlbumResponse>builder()
                .result(response)
                .build();
    }

//    @DeleteMapping("/{id}")
//    public ApiResponse<String> deleteAlbum(@PathVariable String id) {
//        albumService.deleteAlbum(id);
//        return ApiResponse.<String>builder()
//                .result("Album has been deleted")
//                .build();
//    }

    @PutMapping("/{id}/archive")
    public ApiResponse<String> archiveAlbum(@PathVariable String id) {
        albumService.archiveAlbum(id);
        return ApiResponse.<String>builder()
                .result("Album has been archived")
                .build();
    }

    @GetMapping("/new-releases")
    public List<AlbumBriefResponse> getNewReleases() {
        return albumService.getNewAlbumReleases();
    }
}