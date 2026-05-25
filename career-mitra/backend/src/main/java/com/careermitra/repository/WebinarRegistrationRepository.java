package com.careermitra.repository;

import com.careermitra.entity.WebinarRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebinarRegistrationRepository extends JpaRepository<WebinarRegistration, Long> {
    List<WebinarRegistration> findByWebinarId(Long webinarId);
    List<WebinarRegistration> findByStudentId(Long studentId);
    Optional<WebinarRegistration> findByWebinarIdAndStudentId(Long webinarId, Long studentId);
    boolean existsByWebinarIdAndStudentId(Long webinarId, Long studentId);
}
