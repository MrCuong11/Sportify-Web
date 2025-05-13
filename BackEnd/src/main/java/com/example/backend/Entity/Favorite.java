package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "favorite")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @EmbeddedId
    private FavoriteId id;

    @ManyToOne
    @MapsId("user")  // Maps the embedded ID to user
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("song")  // Maps the embedded ID to song
    @JoinColumn(name = "song_id")
    private Song song;
}

