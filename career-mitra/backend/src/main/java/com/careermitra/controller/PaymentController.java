package com.careermitra.controller;

import com.careermitra.dto.PaymentDTO;
import com.careermitra.entity.*;
import com.careermitra.repository.*;
import com.careermitra.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> list = paymentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            Payment payment = paymentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
            return ResponseEntity.ok(convertToDTO(payment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentDTO dto) {
        try {
            Booking booking = bookingRepository.findById(dto.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(booking.getAmount());
            payment.setRazorpayOrderId("order_" + System.currentTimeMillis());
            payment.setStatus(PaymentStatus.PENDING);
            
            payment = paymentRepository.save(payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(payment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        try {
            Payment payment = paymentRepository.findByRazorpayOrderId(request.orderId)
                    .orElseThrow(() -> new RuntimeException("Payment record not found for order id: " + request.orderId));
            
            payment.setRazorpayPaymentId(request.paymentId);
            payment.setRazorpaySignature(request.signature);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment = paymentRepository.save(payment);
            
            return ResponseEntity.ok(new MessageResponse("Payment verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(@RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);
            
            List<Payment> payments;
            if (userDto.getRole().equals("STUDENT")) {
                Student student = studentRepository.findByUserId(userDto.getId())
                        .orElseThrow(() -> new RuntimeException("Student profile not found"));
                List<Booking> bookings = bookingRepository.findByStudent(student);
                payments = bookings.stream()
                        .map(b -> paymentRepository.findByBooking(b).orElse(null))
                        .filter(java.util.Objects::nonNull)
                        .collect(Collectors.toList());
            } else if (userDto.getRole().equals("MENTOR")) {
                Mentor mentor = mentorRepository.findByUserId(userDto.getId())
                        .orElseThrow(() -> new RuntimeException("Mentor profile not found"));
                payments = paymentRepository.findByBookingMentor(mentor);
            } else {
                payments = paymentRepository.findAll();
            }
            
            final String role = userDto.getRole();
            List<PaymentDTO> dtos = payments.stream()
                    .map(p -> {
                        PaymentDTO dto = convertToDTO(p);
                        if (role.equals("MENTOR")) {
                            dto.setAmount(p.getAmount() != null ? p.getAmount() * 0.85 : 0.0);
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setBookingId(payment.getBooking().getId());
        dto.setAmount(payment.getAmount());
        dto.setRazorpayOrderId(payment.getRazorpayOrderId());
        dto.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        dto.setStatus(payment.getStatus().name());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }
}

class PaymentVerifyRequest {
    public String orderId;
    public String paymentId;
    public String signature;
}
