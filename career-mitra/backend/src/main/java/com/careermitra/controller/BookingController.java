package com.careermitra.controller;

import com.careermitra.dto.BookingDTO;
import com.careermitra.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @Autowired
    private com.careermitra.service.AuthService authService;

    @Autowired
    private com.careermitra.repository.StudentRepository studentRepository;

    @Autowired
    private com.careermitra.repository.BookingRepository bookingRepository;

    @GetMapping
    public ResponseEntity<?> getAllBookings(@RequestHeader("Authorization") String token,
                                            @RequestParam(required = false) String status) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);
            if (userDto.getRole().equals("ADMIN")) {
                java.util.List<com.careermitra.dto.BookingDTO> list = bookingService.getAllBookings();
                if (status != null) {
                    final String st = status.toUpperCase();
                    list = list.stream().filter(b -> b.getStatus().equalsIgnoreCase(st)).collect(Collectors.toList());
                }
                return ResponseEntity.ok(list);
            } else if (userDto.getRole().equals("STUDENT")) {
                com.careermitra.entity.Student student = studentRepository.findByUserId(userDto.getId())
                        .orElseThrow(() -> new RuntimeException("Student profile not found"));
                java.util.List<com.careermitra.dto.BookingDTO> list = bookingService.getBookingsByStudent(student.getId());
                if (status != null) {
                    final String st = status.toUpperCase();
                    list = list.stream().filter(b -> b.getStatus().equalsIgnoreCase(st)).collect(Collectors.toList());
                }
                return ResponseEntity.ok(list);
            } else if (userDto.getRole().equals("MENTOR")) {
                com.careermitra.entity.Mentor mentor = mentorRepository.findByUserId(userDto.getId())
                        .orElseThrow(() -> new RuntimeException("Mentor profile not found"));
                java.util.List<com.careermitra.dto.BookingDTO> list = bookingService.getBookingsByMentor(mentor.getId());
                if (status != null) {
                    final String st = status.toUpperCase();
                    list = list.stream().filter(b -> b.getStatus().equalsIgnoreCase(st)).collect(Collectors.toList());
                }
                return ResponseEntity.ok(list);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO dto, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);
            com.careermitra.entity.Student student = studentRepository.findByUserId(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            BookingDTO booking = bookingService.createBooking(dto, student);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @Autowired
    private com.careermitra.repository.MentorRepository mentorRepository;

    @Autowired
    private com.careermitra.repository.AvailabilitySlotRepository availabilitySlotRepository;

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.approveBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long id, @RequestBody(required = false) java.util.Map<String, Object> body) {
        try {
            // Currently rejection reason is not stored; accept it to be compatible with frontend
            BookingDTO booking = bookingService.rejectBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.completeBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/available-slots/{mentorId}")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable Long mentorId,
            @RequestParam String date) {
        try {
            com.careermitra.entity.Mentor mentor = mentorRepository.findById(mentorId)
                    .orElseThrow(() -> new RuntimeException("Mentor not found"));
            
            // Determine day of week
            java.time.LocalDate localDate = java.time.LocalDate.parse(date);
            com.careermitra.entity.SlotDayOfWeek dayOfWeek = com.careermitra.entity.SlotDayOfWeek.valueOf(localDate.getDayOfWeek().name());
            
            // Get configured slots
            List<com.careermitra.entity.AvailabilitySlot> configuredSlots = availabilitySlotRepository.findByMentorAndDayOfWeek(mentor, dayOfWeek);
            
            List<String> allSlots = new java.util.ArrayList<>();
            for (com.careermitra.entity.AvailabilitySlot slot : configuredSlots) {
                allSlots.add(slot.getStartTime() + "-" + slot.getEndTime());
            }
            
            // Get active bookings
            List<com.careermitra.entity.Booking> activeBookings = bookingRepository.findByMentor(mentor).stream()
                    .filter(b -> b.getSessionDate().equals(date) && b.getStatus() != com.careermitra.entity.BookingStatus.REJECTED)
                    .collect(Collectors.toList());
            
            List<String> bookedSlots = activeBookings.stream()
                    .map(com.careermitra.entity.Booking::getTimeSlot)
                    .collect(Collectors.toList());
            
            // Filter out booked slots
            List<String> available = allSlots.stream()
                    .filter(s -> !bookedSlots.contains(s))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            // If date parsing fails, return empty list
            return ResponseEntity.ok(new java.util.ArrayList<String>());
        }
    }
}
