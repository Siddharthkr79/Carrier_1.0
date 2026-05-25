package com.careermitra.service;

import com.careermitra.dto.ReviewDTO;
import com.careermitra.entity.*;
import com.careermitra.exception.BadRequestException;
import com.careermitra.exception.ResourceNotFoundException;
import com.careermitra.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Review Service
 */
@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ReviewDTO createReview(ReviewDTO dto, Student student) {
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Can only review completed bookings");
        }

        if (reviewRepository.findByBooking(booking).isPresent()) {
            throw new BadRequestException("Review already exists for this booking");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setMentor(booking.getMentor());
        review.setStudent(student);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        review = reviewRepository.save(review);

        // Update mentor rating
        updateMentorRating(booking.getMentor());

        return convertToDTO(review);
    }

    public List<ReviewDTO> getReviewsByMentor(Long mentorId) {
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        return reviewRepository.findByMentor(mentor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void updateMentorRating(Mentor mentor) {
        List<Review> reviews = reviewRepository.findByMentor(mentor);
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            mentor.setRating(averageRating);
            mentor.setReviewCount(reviews.size());
            mentorRepository.save(mentor);
        }
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = modelMapper.map(review, ReviewDTO.class);
        dto.setStudentName(review.getStudent().getUser().getName());
        return dto;
    }
}
