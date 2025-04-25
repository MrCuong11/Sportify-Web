package com.example.backend.DTO.Response;

import com.example.backend.DTO.Request.LyricLineRequest;
import lombok.Data;

import java.util.List;

@Data
public class SongResponse {
    private String id;
    private String title;
    private String audioUrl;
    private String duration;
    private Long playCount;
    private String createdAt;

    private String artistName;
//    private String categoryName;
    private String albumName;

    private List<LyricLineRequest> lyrics;
}
