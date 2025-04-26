package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LyricLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String timestamp;

    @Column(columnDefinition = "TEXT")
    private String text;

    @ManyToOne
    @JoinColumn(name = "song_id")
    private Song song;

    public LyricLine() {}

//    public LyricLine(String timestampStr, String text, Song song) {
//        this.timestamp = timestampStr;
//        this.text = text;
//        this.song = song;
//    }
}