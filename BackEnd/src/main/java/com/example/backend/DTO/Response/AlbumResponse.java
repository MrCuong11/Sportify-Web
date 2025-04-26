package com.example.backend.DTO.Response;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AlbumResponse {
    private String id;
    private String name;
    private String coverImageUrl;
    private LocalDate releaseDate;
    private ArtistListResponse artist;
    private List<SongBriefResponse> songs;
}
