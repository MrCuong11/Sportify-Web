package com.example.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
public class Advertisement {
    @Id
    @GeneratedValue
    private UUID id;
    private String content;
    private String imageUrl;
    private String redirectUrl;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "advertisement")
    private List<UserAdvertisement> userAdvertisements;
}