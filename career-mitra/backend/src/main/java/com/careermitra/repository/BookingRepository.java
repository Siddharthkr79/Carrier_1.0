package com.careermitra.repository;

import com.careermitra.entity.Booking;
import com.careermitra.entity.BookingStatus;
import com.careermitra.entity.Mentor;
import com.careermitra.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudent(Student student);
    List<Booking> findByMentor(Mentor mentor);
    List<Booking> findByStatus(BookingStatus status);
    Optional<Booking> findByStudentAndSessionDateAndTimeSlot(Student student, String date, String slot);
}
