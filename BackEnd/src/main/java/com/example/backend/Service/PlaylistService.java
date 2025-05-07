package com.example.backend.Service;

import com.example.backend.DTO.Request.AddSongToPlaylistRequest;
import com.example.backend.DTO.Request.CreatePlaylistRequest;
import com.example.backend.DTO.Response.PlaylistResponse;
import com.example.backend.DTO.Response.PlaylistSongResponse;
import com.example.backend.Entity.Playlist;
import com.example.backend.Entity.PlaylistSong;
import com.example.backend.Entity.Song;
import com.example.backend.Entity.User;
import com.example.backend.Enums.PlaylistStatus;
import com.example.backend.Mapper.PlaylistMapper;
import com.example.backend.Repository.PlaylistRepository;
import com.example.backend.Repository.PlaylistSongRepository;
import com.example.backend.Repository.SongRepository;
import com.example.backend.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final PlaylistMapper playlistMapper;
    private final SongRepository songRepository;
    private final PlaylistSongRepository playlistSongRepository;

    public PlaylistResponse createPlaylist(CreatePlaylistRequest request) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(
                () -> new RuntimeException("USER_NOT_EXISTED"));

        Playlist playlist = Playlist.builder()
                .name(request.getName())
                .image_url(request.getImage_url())
                .isPublic(request.isPublic())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        playlist = playlistRepository.save(playlist);
        return playlistMapper.toResponse(playlist);
    }


    public List<PlaylistSongResponse> addSongsToPlaylist(AddSongToPlaylistRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_EXISTED"));

        Playlist playlist = playlistRepository.findById(request.getPlaylistId())
                .orElseThrow(() -> new RuntimeException("PLAYLIST_NOT_FOUND"));

        if (!playlist.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("UNAUTHORIZED_PLAYLIST_ACCESS");
        }

        List<PlaylistSongResponse> responses = new ArrayList<>();

        for (String songId : request.getSongIds()) {
            Song song = songRepository.findById(songId)
                    .orElseThrow(() -> new RuntimeException("SONG_NOT_FOUND: " + songId));

            // Optional: skip duplicates
            boolean alreadyExists = playlist.getPlaylistSongs().stream()
                    .anyMatch(ps -> ps.getSong().getId().equals(songId));
            if (alreadyExists) continue;

            // Find the next position (assuming it starts from 0 or 1)
            int position = playlistSongRepository.countByPlaylist(playlist);

            PlaylistSong playlistSong = PlaylistSong.builder()
                    .playlist(playlist)
                    .song(song)
                    .position(position)
                    .build();

            playlistSong = playlistSongRepository.save(playlistSong);
            responses.add(playlistMapper.toPlaylistSongResponse(playlistSong));
        }

        return responses;
    }

    public Page<PlaylistResponse> getAllPlaylists(Pageable pageable) {
        Page<Playlist> playlists = playlistRepository.findAll(pageable);
        return playlists.map(playlistMapper::toResponse);
    }

    public Page<PlaylistResponse> getMyPlaylists(Pageable pageable) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_EXISTED"));

        Page<Playlist> playlists = playlistRepository.findByUser(user, pageable);
        return playlists.map(playlistMapper::toResponse);
    }

    public void archivePlaylist (String id){
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Playlist not found"));

        playlist.setStatus(PlaylistStatus.ARCHIVED);
        playlistRepository.save(playlist);
    }

    public void removeSongsFromPlaylist(AddSongToPlaylistRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_EXISTED"));

        Playlist playlist = playlistRepository.findById(request.getPlaylistId())
                .orElseThrow(() -> new RuntimeException("PLAYLIST_NOT_FOUND"));

        if (!playlist.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("UNAUTHORIZED_PLAYLIST_ACCESS");
        }

        for (String songId : request.getSongIds()) {
            Song song = songRepository.findById(songId)
                    .orElseThrow(() -> new RuntimeException("SONG_NOT_FOUND: " + songId));

            // Find the PlaylistSong entry and delete it
            Optional<PlaylistSong> playlistSongOpt = playlistSongRepository
                    .findByPlaylistAndSong(playlist, song);

            playlistSongOpt.ifPresent(playlistSongRepository::delete);
        }
    }






}
