package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "advertisement")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String content;
    private String imageUrl;
    private String redirectUrl;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "advertisement")
    private List<UserAdvertisement> userAdvertisements;
}
