package com.example.backend.DTO.Request;

import lombok.Data;

import java.util.List;

@Data
public class SongRequest {
    private String title;
    private String audioUrl;
    private String duration;

    private String artistId;
//    private Long categoryId;
    private String albumId;

//    private List<LyricLineRequest> lyrics;
}

