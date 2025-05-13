package com.example.backend.DTO.Response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ListeningHistoryResponseDTO {
    private SongSimpleResponse song;
    private LocalDateTime playedAt;
}
