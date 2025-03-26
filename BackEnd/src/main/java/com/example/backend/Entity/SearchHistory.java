package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchHistory {
    @Id
    @GeneratedValue
    private UUID id;
    private String keyword;
    private LocalDateTime searchedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

