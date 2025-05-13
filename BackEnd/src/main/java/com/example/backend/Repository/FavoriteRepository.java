package com.example.backend.Repository;

import com.example.backend.Entity.Favorite;
import com.example.backend.Entity.FavoriteId;
import com.example.backend.Entity.Song;
import com.example.backend.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    boolean existsByUserAndSong(User user, Song song);
    Page<Favorite> findByUser(User user, Pageable pageable);

    void deleteByUserAndSong(User user, Song song);
}
