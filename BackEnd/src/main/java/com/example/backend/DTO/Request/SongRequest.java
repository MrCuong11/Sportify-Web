package com.example.backend.DTO.Request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class SongRequest {
    private String title;
    private String duration;
    private String imgUrl;
    private String artistId;
    private String albumId;
    private MultipartFile file;

//    private List<LyricLineRequest> lyrics;
}

