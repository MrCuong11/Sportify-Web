package com.example.backend.DTO.Request;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CreatePlaylistRequest {
    private String name;
    private String image_url;
    private boolean isPublic;

}
