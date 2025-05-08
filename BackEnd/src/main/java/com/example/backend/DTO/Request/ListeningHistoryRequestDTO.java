package com.example.backend.DTO.Request;

public class ListeningHistoryRequestDTO {
    private String userId;
    private String songId;

    // Getters and setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSongId() { return songId; }
    public void setSongId(String songId) { this.songId = songId; }
}
