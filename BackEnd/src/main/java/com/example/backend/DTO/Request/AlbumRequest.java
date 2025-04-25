package com.example.backend.DTO.Request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
@Data
public class AlbumRequest {
    private String name;
    private String coverImageUrl;
    private LocalDate releaseDate;
    private String artistId;
    private List<String> songIds;
}
