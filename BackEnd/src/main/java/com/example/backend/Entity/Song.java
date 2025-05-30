package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



@Entity
@Table(name = "song")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String audioUrl;
    private String duration;
    private String imgUrl;
    private Long playCount;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;

    //manyToOne (have saw directly in song table)

    @OneToMany(mappedBy = "song")
    private List<ListeningHistory> listeningHistories;

    @OneToMany(mappedBy = "song")
    private List<Favorite> favorites;

    @OneToMany(mappedBy = "song")
    private List<PlaylistSong> playlistSongs;

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LyricLine> lyricLines = new ArrayList<>();
//    oneToMany (didn't see directly in song table)

}

