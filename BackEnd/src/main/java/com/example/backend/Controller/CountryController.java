package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.CountryCreationRequest;
import com.example.backend.DTO.Response.CountryResponse;
import com.example.backend.DTO.Response.CountryWithArtistsResponse;
import com.example.backend.Service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    // Tạo quốc gia mới
    @PostMapping
    public ApiResponse<CountryResponse> createCountry(@RequestBody CountryCreationRequest request) {
        CountryResponse countryResponse = countryService.createCountry(request);
        return ApiResponse.<CountryResponse>builder()
                .result(countryResponse)
                .build();
    }

    // Lấy thông tin quốc gia theo ID
    @GetMapping("/{id}")
    public ApiResponse<CountryResponse> getCountry(@PathVariable Long id) {
        CountryResponse countryResponse = countryService.getCountry(id);
        return ApiResponse.<CountryResponse>builder()
                .result(countryResponse)
                .build();
    }

    // Lấy tất cả quốc gia
    @GetMapping
    public ApiResponse<List<CountryResponse>> getAllCountries() {
        List<CountryResponse> countryResponses = countryService.getAllCountries();
        return ApiResponse.<List<CountryResponse>>builder()
                .result(countryResponses)
                .build();
    }

    // Xóa quốc gia theo ID
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteCountry(@PathVariable Long id) {
        countryService.deleteCountry(id);
        return ApiResponse.<String>builder()
                .result("Country has been deleted")
                .build();
    }

    // get Country with Artists
    @GetMapping("/{id}/with-artists")
    public ApiResponse<CountryWithArtistsResponse> getCountryWithArtists(@PathVariable Long id) {
        return ApiResponse.<CountryWithArtistsResponse>builder()
                .result(countryService.getCountryWithArtists(id))
                .build();
    }
}
