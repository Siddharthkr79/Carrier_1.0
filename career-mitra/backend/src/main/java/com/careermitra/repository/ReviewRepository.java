package com.careermitra.repository;

import com.careermitra.entity.Booking;
import com.careermitra.entity.Mentor;
import com.careermitra.entity.Review;
import com.careermitra.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMentor(Mentor mentor);
    List<Review> findByStudent(Student student);
    Optional<Review> findByBooking(Booking booking);
}
