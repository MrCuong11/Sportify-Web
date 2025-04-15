package com.example.backend.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class CountryWithArtistsResponse {
    private Long id;
    private String name;
    private String code;
    private List<ArtistListResponse> artists;
}