package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_advertisement")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(UserAdvertisementId.class)
public class UserAdvertisement {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "advertisement_id")
    private Advertisement advertisement;

    private LocalDateTime shownAt;
}
