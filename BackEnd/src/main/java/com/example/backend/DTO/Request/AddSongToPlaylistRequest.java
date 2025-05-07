package com.example.backend.DTO.Request;

import lombok.Data;

import java.util.List;

@Data
public class AddSongToPlaylistRequest {
    private String playlistId;
    private List<String> songIds;
}
