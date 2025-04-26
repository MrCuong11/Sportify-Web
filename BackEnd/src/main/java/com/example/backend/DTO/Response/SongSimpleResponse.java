package com.example.backend.DTO.Response;

import lombok.Data;

@Data
public class SongSimpleResponse {
    private String id;
    private String title;
    private String duration;
    private String artistName;
}
