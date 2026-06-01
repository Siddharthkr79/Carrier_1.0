package com.careermitra.service;

import com.careermitra.dto.DashboardStatsDTO;
import com.careermitra.entity.PaymentStatus;
import com.careermitra.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Admin Service
 */
@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalMentors = mentorRepository.count();
        long totalSessions = bookingRepository.count();

        double totalRevenue = paymentRepository.findByStatus(PaymentStatus.COMPLETED).stream()
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0)
                .sum();

        double platformEarnings = totalRevenue * 0.15;

        return new DashboardStatsDTO(totalUsers, totalMentors, totalSessions, totalRevenue, platformEarnings);
    }

    public void blockUser(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setIsActive(false);
            userRepository.save(user);
        });
    }

    public void unblockUser(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setIsActive(true);
            userRepository.save(user);
        });
    }
}
