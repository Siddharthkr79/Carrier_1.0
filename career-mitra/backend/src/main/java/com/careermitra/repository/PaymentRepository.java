package com.careermitra.repository;

import com.careermitra.entity.Booking;
import com.careermitra.entity.Mentor;
import com.careermitra.entity.Payment;
import com.careermitra.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBooking(Booking booking);
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByBookingMentor(Mentor mentor);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}
