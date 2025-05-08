package com.example.backend.Mapper;

import com.example.backend.DTO.Response.ListeningHistoryResponseDTO;
import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Entity.ListeningHistory;
import com.example.backend.Entity.Song;
import org.springframework.stereotype.Component;

@Component
public class ListeningHistoryMapper {

    public ListeningHistoryResponseDTO toDTO(ListeningHistory history) {
        Song song = history.getSong();

        SongSimpleResponse songDto = new SongSimpleResponse();
        songDto.setId(song.getId());
        songDto.setTitle(song.getTitle());
        songDto.setDuration(song.getDuration()); // assume it's already formatted
        songDto.setImgUrl(song.getImgUrl());
        songDto.setArtistName(song.getArtist().getName());

        ListeningHistoryResponseDTO dto = new ListeningHistoryResponseDTO();
        dto.setSong(songDto);
        dto.setPlayedAt(history.getPlayedAt());

        return dto;
    }
}

