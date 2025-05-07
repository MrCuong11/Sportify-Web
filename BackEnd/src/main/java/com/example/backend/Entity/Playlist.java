package com.example.backend.Entity;

import com.example.backend.Enums.AlbumStatus;
import com.example.backend.Enums.PlaylistStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;



@Entity
@Table(name = "playlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private boolean isPublic;
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String image_url;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "playlist")
    private List<PlaylistSong> playlistSongs;
    @Enumerated(EnumType.STRING)
    private PlaylistStatus status = PlaylistStatus.ACTIVE;  // Mặc định là ACTIVE
}

