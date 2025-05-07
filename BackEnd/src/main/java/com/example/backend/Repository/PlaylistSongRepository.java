package com.example.backend.Repository;

import com.example.backend.Entity.Playlist;
import com.example.backend.Entity.PlaylistSong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, Long> {
    int countByPlaylist(Playlist playlist);
}
