package com.example.backend.Repository;

import com.example.backend.Entity.Playlist;
import com.example.backend.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, String> {
    Page<Playlist> findByUser(User user, Pageable pageable);


}

