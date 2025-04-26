package com.example.backend.Repository;

import com.example.backend.Entity.LyricLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LyricLineRepository extends JpaRepository<LyricLine, Long> {
}
