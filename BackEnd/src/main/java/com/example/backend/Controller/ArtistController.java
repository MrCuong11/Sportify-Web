package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.ArtistCreationRequest;
import com.example.backend.DTO.Response.ArtistDetailResponse;
import com.example.backend.DTO.Response.ArtistResponse;
import com.example.backend.Service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;

    @PostMapping
    public ApiResponse<ArtistResponse> create(@RequestBody ArtistCreationRequest request) {
        return ApiResponse.<ArtistResponse>builder()
                .result(artistService.createArtist(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ArtistDetailResponse> getDetails(@PathVariable String id) {
        // Gọi phương thức service trả về ArtistDetailResponse
        return ApiResponse.<ArtistDetailResponse>builder()
                .result(artistService.getArtistDetailsById(id))
                .build();
    }

    @GetMapping
    // Thêm @ParameterObject vào tham số Pageable
    public ApiResponse<Page<ArtistResponse>> getAll(@ParameterObject Pageable pageable) {
        Page<ArtistResponse> artistPage = artistService.getAllArtists(pageable);
        return ApiResponse.<Page<ArtistResponse>>builder()
                .result(artistPage)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ArtistResponse> update(@PathVariable String id, @RequestBody ArtistCreationRequest request) {
        return ApiResponse.<ArtistResponse>builder()
                .result(artistService.updateArtist(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        artistService.deleteArtist(id);
        return ApiResponse.<String>builder()
                .result("Artist has been deleted")
                .build();
    }
}
