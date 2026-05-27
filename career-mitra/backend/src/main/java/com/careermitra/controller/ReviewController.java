package com.careermitra.controller;

import com.careermitra.dto.ReviewDTO;
import com.careermitra.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private com.careermitra.service.AuthService authService;

    @Autowired
    private com.careermitra.repository.StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(new java.util.ArrayList<>());
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDTO dto, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);
            com.careermitra.entity.Student student = studentRepository.findByUserId(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            ReviewDTO review = reviewService.createReview(dto, student);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByMentor(@PathVariable Long mentorId) {
        return ResponseEntity.ok(reviewService.getReviewsByMentor(mentorId));
    }
}
