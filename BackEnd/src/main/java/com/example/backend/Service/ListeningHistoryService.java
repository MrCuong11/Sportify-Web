package com.example.backend.Service;

import com.example.backend.DTO.Request.ListeningHistoryRequestDTO;
import com.example.backend.DTO.Response.ListeningHistoryResponseDTO;
import com.example.backend.Entity.ListeningHistory;
import com.example.backend.Entity.Song;
import com.example.backend.Entity.User;
import com.example.backend.Mapper.ListeningHistoryMapper;
import com.example.backend.Repository.ListeningHistoryRepository;
import com.example.backend.Repository.SongRepository;
import com.example.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ListeningHistoryService {

    private final ListeningHistoryRepository listeningHistoryRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;

    private final ListeningHistoryMapper mapper;
    public void recordTrack(ListeningHistoryRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = songRepository.findById(request.getSongId())
                .orElseThrow(() -> new RuntimeException("Song not found"));

        // Check if user already listened to this song
        Optional<ListeningHistory> existingHistory =
                listeningHistoryRepository.findByUserIdAndSongId(request.getUserId(), request.getSongId());

        if (existingHistory.isPresent()) {
            ListeningHistory history = existingHistory.get();
            history.setPlayedAt(LocalDateTime.now());
            listeningHistoryRepository.save(history);
        } else {
            ListeningHistory history = new ListeningHistory();
            history.setUser(user);
            history.setSong(song);
            history.setPlayedAt(LocalDateTime.now());
            listeningHistoryRepository.save(history);
        }
    }

    public Page<ListeningHistoryResponseDTO> getAllListeningHistory(String userId, int page, int size) {
        Page<ListeningHistory> historyPage = listeningHistoryRepository.findByUserId(
                userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "playedAt"))
        );

        return historyPage.map(mapper::toDTO);
    }

}