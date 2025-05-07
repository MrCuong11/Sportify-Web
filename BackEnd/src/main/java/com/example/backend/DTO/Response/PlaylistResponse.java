package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaylistResponse {
    private String id;
    private String name;
    private String image_url;
    private boolean isPublic;
    private LocalDateTime createdAt;
    private String userId;
    private List<PlaylistSongResponse> songs;
}
