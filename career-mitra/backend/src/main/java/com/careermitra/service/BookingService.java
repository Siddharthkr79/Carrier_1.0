package com.careermitra.service;

import com.careermitra.dto.BookingDTO;
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
 * Booking Service
 */
@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return convertToDTO(booking);
    }

    public BookingDTO createBooking(BookingDTO dto, Student student) {
        Mentor mentor = mentorRepository.findById(dto.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        // Check if time slot is already booked
        var existing = bookingRepository.findByStudentAndSessionDateAndTimeSlot(
                student, dto.getSessionDate(), dto.getTimeSlot());

        if (existing.isPresent()) {
            throw new BadRequestException("Time slot already booked");
        }

        Booking booking = new Booking();
        booking.setStudent(student);
        booking.setMentor(mentor);
        booking.setSessionDate(dto.getSessionDate());
        booking.setTimeSlot(dto.getTimeSlot());
        booking.setTopic(dto.getTopic());
        booking.setDescription(dto.getDescription());
        booking.setAmount(mentor.getSessionPrice());
        booking.setStatus(BookingStatus.PENDING);

        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }

    public BookingDTO approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.APPROVED);
        
        // Generate unique Jitsi Meet video room link
        String randomHash = java.util.UUID.randomUUID().toString().substring(0, 8);
        String meetingUrl = "https://meet.jit.si/CareerMitra-Session-" + id + "-" + randomHash;
        booking.setMeetingLink(meetingUrl);
        
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }

    public BookingDTO rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.REJECTED);
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }

    public BookingDTO completeBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }

    public List<BookingDTO> getBookingsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return bookingRepository.findByStudent(student).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByMentor(Long mentorId) {
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        return bookingRepository.findByMentor(mentor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = modelMapper.map(booking, BookingDTO.class);
        dto.setStudentId(booking.getStudent().getId());
        dto.setStudentName(booking.getStudent().getUser().getName());
        dto.setMentorId(booking.getMentor().getId());
        dto.setMentorName(booking.getMentor().getUser().getName());
        return dto;
    }
}
