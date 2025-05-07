package com.example.backend.Repository;

import com.example.backend.Entity.Playlist;
import com.example.backend.Entity.PlaylistSong;
import com.example.backend.Entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, Long> {
    int countByPlaylist(Playlist playlist);
    Optional<PlaylistSong> findByPlaylistAndSong(Playlist playlist, Song song);
}
