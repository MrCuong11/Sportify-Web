package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Song {
    @Id
    @GeneratedValue
    private UUID id;
    private String title;
    private String audioUrl;
    private int duration;
    private String lyrics;
    private int playCount;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;

    @OneToMany(mappedBy = "song")
    private List<ListeningHistory> listeningHistories;

    @OneToMany(mappedBy = "song")
    private List<Favorite> favorites;

    @OneToMany(mappedBy = "song")
    private List<PlaylistSong> playlistSongs;
}
