package com.example.backend.DTO.Response;

public class LyricLineDto {
    private String timestamp;
    private String text;

    public LyricLineDto(String timestamp, String text) {
        this.timestamp = timestamp;
        this.text = text;
    }

    // Getters
    public String getTimestamp() {
        return timestamp;
    }

    public String getText() {
        return text;
    }
}
