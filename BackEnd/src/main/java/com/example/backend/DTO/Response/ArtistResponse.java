package com.example.backend.DTO.Response;

import lombok.Data;

@Data
public class ArtistResponse {
    private String id;
    private String name;
    private String bio;
    private String imageUrl;
    private String countryName;
}
