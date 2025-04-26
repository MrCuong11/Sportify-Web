package com.example.backend.DTO.Response;

import lombok.Data;

@Data
public class ArtistListResponse {
    private String id;
    private String name;
    public ArtistListResponse(String id, String name) {
        this.id = id;
        this.name = name;
    }
    public ArtistListResponse() {
    }
}
