package com.example.backend.Service;

import com.example.backend.DTO.Request.AddSongToPlaylistRequest;
import com.example.backend.DTO.Request.CreatePlaylistRequest;
import com.example.backend.DTO.Response.PlaylistResponse;
import com.example.backend.DTO.Response.PlaylistSongResponse;
import com.example.backend.Entity.Playlist;
import com.example.backend.Entity.PlaylistSong;
import com.example.backend.Entity.Song;
import com.example.backend.Entity.User;
import com.example.backend.Mapper.PlaylistMapper;
import com.example.backend.Repository.PlaylistRepository;
import com.example.backend.Repository.PlaylistSongRepository;
import com.example.backend.Repository.SongRepository;
import com.example.backend.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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



}
