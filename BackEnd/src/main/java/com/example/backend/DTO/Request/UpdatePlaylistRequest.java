package com.example.backend.DTO.Request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlaylistRequest {
    private String name;
    private String imageUrl;
    private boolean isPublic;
}
