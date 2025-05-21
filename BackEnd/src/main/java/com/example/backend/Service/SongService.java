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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
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
    private final UserRepository userRepository;
    private final GcsService gcsService;

    public SongResponse createSong(SongRequest request) {
        Song song = songMapper.toEntity(request);

        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new IllegalArgumentException("Artist not found"));
        Album album = albumRepository.findById(request.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));

        song.setArtist(artist);
        song.setAlbum(album);

        try {
            String audioUrl = gcsService.uploadFile(request.getFile());
            song.setAudioUrl(audioUrl);
        } catch (IOException e) {
            throw new RuntimeException("Upload audio failed", e);
        }

        Song saved = songRepository.save(song);
        return songMapper.toResponse(saved);
    }

    public Page<SongSimpleResponse> getAllSongs(Pageable pageable) {
        return songRepository.findAll(pageable)
                .map(songMapper::toSimpleResponse);
    }


    public SongResponse getSongById(String songId) {
        // Lấy username từ context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm user từ database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_EXISTED"));

        String userId = user.getId();

        // Lấy bài hát từ DB
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        // Tăng play count
        song.setPlayCount(song.getPlayCount() + 1);
        songRepository.save(song);

        // Ghi lại lịch sử nghe
        ListeningHistoryRequestDTO historyDTO = new ListeningHistoryRequestDTO();
        historyDTO.setUserId(userId);
        historyDTO.setSongId(songId);
        listeningHistoryService.recordTrack(historyDTO);

        // Trả về response
        return songMapper.toResponse(song);
    }


    public Page<SongSimpleResponse> getSongsOrderedByPlayCount(Pageable pageable) {
        return songRepository.findAllByOrderByPlayCountDesc(pageable)
                .map(songMapper::toSimpleResponse);
    }

    public List<SongSimpleResponse> getNewSongs() {
        return songRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(songMapper::toSimpleResponse)
                .collect(Collectors.toList());
    }




    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));
        songRepository.delete(song);
    }
}
