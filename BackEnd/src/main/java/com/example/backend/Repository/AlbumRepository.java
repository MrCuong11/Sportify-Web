package com.example.backend.Repository;

import com.example.backend.Entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, String> {
    List<Album> findTop10ByOrderByReleaseDateDesc();
}
