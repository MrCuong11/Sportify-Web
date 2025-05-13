package com.example.backend.Repository;

import com.example.backend.Entity.PasswordResetToken;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
    boolean existsByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);

}
