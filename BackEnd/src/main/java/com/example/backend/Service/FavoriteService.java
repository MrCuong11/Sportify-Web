package com.example.backend.Service;

import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Entity.Favorite;
import com.example.backend.Entity.FavoriteId;
import com.example.backend.Entity.Song;
import com.example.backend.Entity.User;
import com.example.backend.Mapper.SongMapper;
import com.example.backend.Repository.FavoriteRepository;
import com.example.backend.Repository.SongRepository;
import com.example.backend.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final SongMapper songMapper;

    // Get current user from SecurityContext
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // Add a song to favorites
    
    public void addToFavorites(String songId) {
        User user = getCurrentUser();
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        boolean exists = favoriteRepository.existsByUserAndSong(user, song);
        if (!exists) {
            Favorite favorite = Favorite.builder()
                    .id(new FavoriteId(user.getId(), song.getId()))
                    .user(user)
                    .song(song)
                    .build();
            favoriteRepository.save(favorite);
        }
    }

    @Transactional
    public void removeFromFavorites(String songId) {
        User user = getCurrentUser();
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        favoriteRepository.deleteByUserAndSong(user, song);
    }


    // List all favorites
    public Page<SongSimpleResponse> getFavoriteSongs(Pageable pageable) {
        User user = getCurrentUser();
        Page<Favorite> favoritesPage = favoriteRepository.findByUser(user, pageable);

        return favoritesPage.map(fav -> songMapper.toSimpleResponse(fav.getSong()));
    }

}