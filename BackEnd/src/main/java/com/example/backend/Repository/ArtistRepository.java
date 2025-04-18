package com.example.backend.Repository;

import com.example.backend.Entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, String> {
}