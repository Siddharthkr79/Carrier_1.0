package com.careermitra.repository;

import com.careermitra.entity.Mentor;
import com.careermitra.entity.MentorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {
    Optional<Mentor> findByUserId(Long userId);
    List<Mentor> findByStatus(MentorStatus status);
    List<Mentor> findByDomain(String domain);
    List<Mentor> findByYearsOfExperienceGreaterThanEqual(Integer years);
}
