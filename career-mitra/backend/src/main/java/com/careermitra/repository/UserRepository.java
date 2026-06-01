package com.careermitra.repository;

import com.careermitra.entity.User;
import com.careermitra.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
    List<User> findByRole(UserRole role);
    List<User> findByIsActive(Boolean isActive);
}
