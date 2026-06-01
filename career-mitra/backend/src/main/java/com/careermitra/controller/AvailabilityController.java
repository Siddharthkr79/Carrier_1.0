package com.careermitra.controller;

import com.careermitra.dto.AvailabilityDTO;
import com.careermitra.entity.*;
import com.careermitra.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class AvailabilityController {

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @GetMapping("/{mentorId}")
    public ResponseEntity<List<AvailabilityDTO>> getAvailability(@PathVariable Long mentorId) {
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        List<AvailabilityDTO> list = availabilitySlotRepository.findByMentor(mentor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> addAvailability(@RequestBody AvailabilityDTO dto) {
        try {
            if (dto.getStartTime() == null || dto.getEndTime() == null) {
                throw new IllegalArgumentException("Start time and end time are required");
            }
            java.time.LocalTime start = java.time.LocalTime.parse(dto.getStartTime());
            java.time.LocalTime end = java.time.LocalTime.parse(dto.getEndTime());
            if (!start.isBefore(end)) {
                throw new IllegalArgumentException("Start time must be before end time");
            }

            Mentor mentor = mentorRepository.findById(dto.getMentorId())
                    .orElseThrow(() -> new RuntimeException("Mentor not found"));

            AvailabilitySlot slot = new AvailabilitySlot();
            slot.setMentor(mentor);
            slot.setDayOfWeek(SlotDayOfWeek.valueOf(dto.getDayOfWeek().toUpperCase()));
            slot.setStartTime(dto.getStartTime());
            slot.setEndTime(dto.getEndTime());

            slot = availabilitySlotRepository.save(slot);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(slot));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody AvailabilityDTO dto) {
        try {
            if (dto.getStartTime() == null || dto.getEndTime() == null) {
                throw new IllegalArgumentException("Start time and end time are required");
            }
            java.time.LocalTime start = java.time.LocalTime.parse(dto.getStartTime());
            java.time.LocalTime end = java.time.LocalTime.parse(dto.getEndTime());
            if (!start.isBefore(end)) {
                throw new IllegalArgumentException("Start time must be before end time");
            }

            AvailabilitySlot slot = availabilitySlotRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Availability slot not found"));

            slot.setDayOfWeek(SlotDayOfWeek.valueOf(dto.getDayOfWeek().toUpperCase()));
            slot.setStartTime(dto.getStartTime());
            slot.setEndTime(dto.getEndTime());

            slot = availabilitySlotRepository.save(slot);
            return ResponseEntity.ok(convertToDTO(slot));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        try {
            availabilitySlotRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("Availability deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    private AvailabilityDTO convertToDTO(AvailabilitySlot slot) {
        AvailabilityDTO dto = new AvailabilityDTO();
        dto.setId(slot.getId());
        dto.setMentorId(slot.getMentor().getId());
        dto.setDayOfWeek(slot.getDayOfWeek().name());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        return dto;
    }
}
