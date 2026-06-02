package com.careermitra.controller;

import com.careermitra.dto.*;
import com.careermitra.service.AdminService;
import com.careermitra.service.MentorService;
import com.careermitra.service.BookingService;
import com.careermitra.repository.UserRepository;
import com.careermitra.repository.PaymentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @Autowired
    private MentorService mentorService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            DashboardStatsDTO stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(u -> {
                    UserDTO dto = modelMapper.map(u, UserDTO.class);
                    if (u.getStudent() != null) {
                        StudentDTO studentDTO = modelMapper.map(u.getStudent(), StudentDTO.class);
                        studentDTO.setName(u.getName());
                        dto.setStudent(studentDTO);
                    }
                    if (u.getMentor() != null) {
                        dto.setMentor(mentorService.convertToDTO(u.getMentor()));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<MentorDTO>> getAllMentors() {
        return ResponseEntity.ok(mentorService.getAllMentors());
    }

    @PutMapping("/mentors/{id}/approve")
    public ResponseEntity<?> approveMentor(@PathVariable Long id) {
        try {
            mentorService.approveMentor(id);
            return ResponseEntity.ok(new MessageResponse("Mentor approved"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/mentors/{id}/reject")
    public ResponseEntity<?> rejectMentor(@PathVariable Long id) {
        try {
            mentorService.rejectMentor(id);
            return ResponseEntity.ok(new MessageResponse("Mentor rejected"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long id) {
        try {
            adminService.blockUser(id);
            return ResponseEntity.ok(new MessageResponse("User blocked"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Long id) {
        try {
            adminService.unblockUser(id);
            return ResponseEntity.ok(new MessageResponse("User unblocked"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> payments = paymentRepository.findAll().stream()
                .map(p -> {
                    PaymentDTO dto = new PaymentDTO();
                    dto.setId(p.getId());
                    dto.setBookingId(p.getBooking().getId());
                    dto.setAmount(p.getAmount());
                    dto.setRazorpayOrderId(p.getRazorpayOrderId());
                    dto.setRazorpayPaymentId(p.getRazorpayPaymentId());
                    dto.setStatus(p.getStatus().name());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(payments);
    }
}
