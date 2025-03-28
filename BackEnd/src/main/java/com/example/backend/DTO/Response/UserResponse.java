package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;

    private String username;
    private String email;
//    private String password;
    private String role;
    private boolean premium;
    private String themePreference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
