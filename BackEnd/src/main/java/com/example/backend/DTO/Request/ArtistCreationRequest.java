package com.example.backend.DTO.Request;

import lombok.Data;

@Data
public class ArtistCreationRequest {
    private String name;
    private String bio;
    private String imageUrl;
    private Long countryId;
}