package com.example.backend.Service;


import com.example.backend.DTO.Request.ListeningHistoryRequestDTO;
import com.example.backend.DTO.Request.SongRequest;
import com.example.backend.DTO.Response.SongResponse;
import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Entity.*;
import com.example.backend.Mapper.SongMapper;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final SongMapper songMapper;
    private final ListeningHistoryService listeningHistoryService;

    public SongResponse createSong(SongRequest request) {
        // Map base fields
        Song song = songMapper.toEntity(request);

        // Set related entities using IDs
        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new IllegalArgumentException("Artist not found"));
        Album album = albumRepository.findById(request.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));

        song.setArtist(artist);
        song.setAlbum(album);
        Song saved = songRepository.save(song);
        return songMapper.toResponse(saved);
    }

    public Page<SongSimpleResponse> getAllSongs(Pageable pageable) {
        return songRepository.findAll(pageable)
                .map(songMapper::toSimpleResponse);
    }


    public SongResponse getSongById(String songId, String userId) {
        // Retrieve the song by ID
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        // Increment play count
        song.setPlayCount(song.getPlayCount() + 1);
        songRepository.save(song);


        ListeningHistoryRequestDTO historyDTO = new ListeningHistoryRequestDTO();
        historyDTO.setUserId(userId);
        historyDTO.setSongId(songId);
        listeningHistoryService.recordTrack(historyDTO);

        // Return response
        return songMapper.toResponse(song);
    }



    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));
        songRepository.delete(song);
    }
}
