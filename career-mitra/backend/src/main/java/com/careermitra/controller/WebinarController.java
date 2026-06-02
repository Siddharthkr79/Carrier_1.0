package com.careermitra.controller;

import com.careermitra.dto.UserDTO;
import com.careermitra.dto.WebinarDTO;
import com.careermitra.entity.Mentor;
import com.careermitra.entity.Student;
import com.careermitra.entity.Webinar;
import com.careermitra.entity.WebinarRegistration;
import com.careermitra.repository.MentorRepository;
import com.careermitra.repository.StudentRepository;
import com.careermitra.repository.WebinarRegistrationRepository;
import com.careermitra.repository.WebinarRepository;
import com.careermitra.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/webinars")
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class WebinarController {

    @Autowired
    private WebinarRepository webinarRepository;

    @Autowired
    private WebinarRegistrationRepository webinarRegistrationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<?> getAllWebinars(@RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            UserDTO userDto = authService.verifyToken(cleanToken);

            List<Webinar> webinars = webinarRepository.findAll();
            List<WebinarDTO> dtoList = new ArrayList<>();

            Long studentId = null;
            if (userDto.getRole().equals("STUDENT")) {
                Student student = studentRepository.findByUserId(userDto.getId()).orElse(null);
                if (student != null) {
                    studentId = student.getId();
                }
            }

            for (Webinar w : webinars) {
                WebinarDTO dto = new WebinarDTO();
                dto.setId(w.getId());
                dto.setTitle(w.getTitle());
                dto.setDescription(w.getDescription());
                dto.setMentorId(w.getMentorId());
                dto.setMentorName(w.getMentorName());
                dto.setSessionDate(w.getSessionDate());
                dto.setTimeSlot(w.getTimeSlot());
                dto.setPrice(w.getPrice());
                dto.setCapacityLimit(w.getCapacityLimit());
                dto.setRegisteredCount(w.getRegisteredCount());
                dto.setStatus(w.getStatus());
                dto.setMeetingLink(w.getMeetingLink());

                if (studentId != null) {
                    boolean registered = webinarRegistrationRepository.existsByWebinarIdAndStudentId(w.getId(), studentId);
                    dto.setRegistered(registered);
                } else {
                    dto.setRegistered(false);
                }

                dtoList.add(dto);
            }

            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createWebinar(@RequestBody WebinarDTO dto, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            UserDTO userDto = authService.verifyToken(cleanToken);

            if (!userDto.getRole().equals("MENTOR")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("Only mentors can schedule webinars"));
            }

            Mentor mentor = mentorRepository.findByUserId(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("Mentor profile not found"));

            if (dto.getPrice() != null && dto.getPrice() < 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Price cannot be negative"));
            }

            Webinar webinar = new Webinar();
            webinar.setTitle(dto.getTitle());
            webinar.setDescription(dto.getDescription());
            webinar.setMentorId(mentor.getId());
            webinar.setMentorName(mentor.getUser().getName());
            webinar.setSessionDate(dto.getSessionDate());
            webinar.setTimeSlot(dto.getTimeSlot());
            webinar.setPrice(dto.getPrice());
            webinar.setCapacityLimit(dto.getCapacityLimit());
            webinar.setRegisteredCount(0);
            webinar.setStatus("UPCOMING");
            webinar.setMeetingLink("");

            Webinar saved = webinarRepository.save(webinar);
            dto.setId(saved.getId());
            dto.setMentorId(saved.getMentorId());
            dto.setMentorName(saved.getMentorName());
            dto.setStatus(saved.getStatus());

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForWebinar(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            UserDTO userDto = authService.verifyToken(cleanToken);

            if (!userDto.getRole().equals("STUDENT")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("Only students can register for webinars"));
            }

            Student student = studentRepository.findByUserId(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));

            Webinar webinar = webinarRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Webinar not found"));

            boolean alreadyRegistered = webinarRegistrationRepository.existsByWebinarIdAndStudentId(id, student.getId());
            if (alreadyRegistered) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("You are already registered for this webinar"));
            }

            if (webinar.getRegisteredCount() >= webinar.getCapacityLimit()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Webinar is full"));
            }

            WebinarRegistration reg = new WebinarRegistration();
            reg.setWebinarId(id);
            reg.setStudentId(student.getId());
            reg.setStudentName(student.getUser().getName());
            reg.setStudentEmail(student.getUser().getEmail());

            webinarRegistrationRepository.save(reg);

            webinar.setRegisteredCount(webinar.getRegisteredCount() + 1);
            webinarRepository.save(webinar);

            return ResponseEntity.ok(new MessageResponse("Successfully registered for webinar"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<?> startWebinar(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            UserDTO userDto = authService.verifyToken(cleanToken);

            if (!userDto.getRole().equals("MENTOR")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("Only hosts can start the webinar"));
            }

            Webinar webinar = webinarRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Webinar not found"));

            webinar.setStatus("ACTIVE");
            String randomHash = UUID.randomUUID().toString().substring(0, 8);
            webinar.setMeetingLink("https://meet.jit.si/CareerMitra-Webinar-" + id + "-" + randomHash);
            webinarRepository.save(webinar);

            return ResponseEntity.ok(webinar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeWebinar(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            authService.verifyToken(cleanToken);

            Webinar webinar = webinarRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Webinar not found"));

            webinar.setStatus("COMPLETED");
            webinarRepository.save(webinar);

            return ResponseEntity.ok(webinar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelWebinar(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            UserDTO userDto = authService.verifyToken(cleanToken);

            if (!userDto.getRole().equals("MENTOR")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("Only mentors can cancel webinars"));
            }

            Webinar webinar = webinarRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Webinar not found"));

            Mentor mentor = mentorRepository.findByUserId(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("Mentor profile not found"));
            
            if (!webinar.getMentorId().equals(mentor.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("Only the host mentor can cancel this webinar"));
            }

            webinar.setStatus("CANCELLED");
            webinarRepository.save(webinar);

            return ResponseEntity.ok(webinar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Helper Response Classes
    private static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }

    private static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
