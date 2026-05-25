package com.careermitra.repository;

import com.careermitra.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebinarRepository extends JpaRepository<Webinar, Long> {
    List<Webinar> findByMentorId(Long mentorId);
}
