package com.example.backend.DTO.Response;

import lombok.Data;

import java.util.List;

@Data
public class LyricUploadResponse {
    private List<LyricLineDto> lyrics;
    private SongBriefResponse song;
}
