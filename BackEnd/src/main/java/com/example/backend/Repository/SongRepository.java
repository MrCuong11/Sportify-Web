package com.example.backend.Repository;

import com.example.backend.Entity.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, String> {
    Page<Song> findAllByOrderByPlayCountDesc(Pageable pageable);
    List<Song> findTop10ByOrderByCreatedAtDesc();

}
