package com.example.backend.Repository;

import com.example.backend.Entity.ListeningHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, String> {
    Optional<ListeningHistory> findByUserIdAndSongId(String userId, String songId);
    Page<ListeningHistory> findByUserId(String userId, Pageable pageable);

}