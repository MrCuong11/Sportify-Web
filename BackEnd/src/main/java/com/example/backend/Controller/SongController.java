package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.SongRequest;
import com.example.backend.DTO.Response.SongResponse;
import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<SongResponse> createSong(@ModelAttribute SongRequest request) {
        return ApiResponse.<SongResponse>builder()
                .result(songService.createSong(request))
                .build();
    }

//    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ApiResponse<SongResponse> createSong(
//            @ModelAttribute SongRequest request,  // Các trường khác
//            @RequestPart("file") MultipartFile file  // Tệp
//    ) {
//        // Gán tệp vào SongRequest trước khi truyền cho service
//        request.setFile(file);
//        return ApiResponse.<SongResponse>builder()
//                .result(songService.createSong(request))
//                .build();
//    }



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
    public ApiResponse<SongResponse> getSongById(@PathVariable String id) {
        return ApiResponse.<SongResponse>builder()
                .result(songService.getSongById(id))
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


//    top songs trending
    @GetMapping("/top")
    public ApiResponse<Page<SongSimpleResponse>> getTopSongs(Pageable pageable) {
        Page<SongSimpleResponse> result = songService.getSongsOrderedByPlayCount(pageable);
        return ApiResponse.<Page<SongSimpleResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/new-releases")
    public ApiResponse<List<SongSimpleResponse>>  getNewSongReleases() {
        List<SongSimpleResponse> result = songService.getNewSongs();
        return ApiResponse.<List<SongSimpleResponse>>builder()
                .result(result)
                .build();
    }

}
