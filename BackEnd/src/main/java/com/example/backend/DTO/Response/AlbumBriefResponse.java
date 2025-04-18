package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumBriefResponse {
    private String id;
    private String name;
    private String coverImageUrl;
    private LocalDate releaseDate;
}
