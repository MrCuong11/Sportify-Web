package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistDetailResponse {
    private String id;
    private String name;
    private String bio;
    private String imageUrl;

    private String countryName;

    private List<AlbumBriefResponse> albums;
    private List<SongBriefResponse> songs;

}
