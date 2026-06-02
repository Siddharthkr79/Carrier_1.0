package com.careermitra.service;

import com.careermitra.dto.MentorDTO;
import com.careermitra.entity.MentorStatus;
import com.careermitra.entity.Mentor;
import com.careermitra.entity.User;
import com.careermitra.exception.ResourceNotFoundException;
import com.careermitra.repository.MentorRepository;
import com.careermitra.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mentor Service
 */
@Service
public class MentorService {
    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<MentorDTO> getAllMentors() {
        return mentorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MentorDTO> getApprovedMentors() {
        return mentorRepository.findByStatus(MentorStatus.APPROVED).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MentorDTO getMentorById(Long id) {
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        return convertToDTO(mentor);
    }

    public MentorDTO getMentorByUserId(Long userId) {
        Mentor mentor = mentorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        return convertToDTO(mentor);
    }

    public MentorDTO createMentor(MentorDTO dto, User user) {
        Mentor mentor = new Mentor();
        mentor.setUser(user);
        mentor.setBio(dto.getBio());
        mentor.setCompany(dto.getCompany());
        mentor.setDomain(dto.getDomain());
        mentor.setYearsOfExperience(dto.getYearsOfExperience());
        mentor.setSessionPrice(dto.getSessionPrice());
        mentor.setLinkedinUrl(dto.getLinkedinUrl());
        mentor.setSupportiveDocumentUrl(dto.getSupportiveDocumentUrl());

        try {
            if (dto.getSkills() != null) {
                mentor.setSkills(objectMapper.writeValueAsString(dto.getSkills()));
            }
            if (dto.getExpertise() != null) {
                mentor.setExpertise(objectMapper.writeValueAsString(dto.getExpertise()));
            }
        } catch (Exception e) {
            // fallback to empty JSON array string on error
            mentor.setSkills("[]");
            mentor.setExpertise("[]");
        }

        mentor = mentorRepository.save(mentor);
        return convertToDTO(mentor);
    }

    public MentorDTO updateMentor(Long id, MentorDTO dto) {
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        mentor.setBio(dto.getBio());
        mentor.setCompany(dto.getCompany());
        mentor.setDomain(dto.getDomain());
        mentor.setYearsOfExperience(dto.getYearsOfExperience());
        mentor.setSessionPrice(dto.getSessionPrice());
        mentor.setLinkedinUrl(dto.getLinkedinUrl());
        mentor.setSupportiveDocumentUrl(dto.getSupportiveDocumentUrl());
        if (dto.getPhotoUrl() != null && !dto.getPhotoUrl().startsWith("data:image")) {
            mentor.setPhotoUrl(dto.getPhotoUrl());
        }

        try {
            if (dto.getSkills() != null) {
                mentor.setSkills(objectMapper.writeValueAsString(dto.getSkills()));
            }
            if (dto.getExpertise() != null) {
                mentor.setExpertise(objectMapper.writeValueAsString(dto.getExpertise()));
            }
        } catch (Exception e) {
            // preserve existing values or set empty JSON arrays on error
            if (mentor.getSkills() == null) mentor.setSkills("[]");
            if (mentor.getExpertise() == null) mentor.setExpertise("[]");
        }

        mentor = mentorRepository.save(mentor);
        return convertToDTO(mentor);
    }

    public void approveMentor(Long id) {
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        mentor.setStatus(MentorStatus.APPROVED);
        mentorRepository.save(mentor);
    }

    public void rejectMentor(Long id) {
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        mentor.setStatus(MentorStatus.REJECTED);
        mentorRepository.save(mentor);
    }

    public List<MentorDTO> searchMentors(String domain, Integer minExperience, Double maxPrice) {
        List<Mentor> mentors = mentorRepository.findAll();

        return mentors.stream()
                .filter(m -> domain == null || m.getDomain().equalsIgnoreCase(domain))
                .filter(m -> minExperience == null || m.getYearsOfExperience() >= minExperience)
                .filter(m -> maxPrice == null || m.getSessionPrice() <= maxPrice)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MentorDTO convertToDTO(Mentor mentor) {
        MentorDTO dto = modelMapper.map(mentor, MentorDTO.class);
        dto.setName(mentor.getUser().getName());
        // Parse skills and expertise arrays from JSON strings
        try {
            if (mentor.getSkills() != null && !mentor.getSkills().isEmpty()) {
                dto.setSkills(objectMapper.readValue(mentor.getSkills(), String[].class));
            }
        } catch (Exception e) {
            dto.setSkills(new String[]{});
        }
        try {
            if (mentor.getExpertise() != null && !mentor.getExpertise().isEmpty()) {
                dto.setExpertise(objectMapper.readValue(mentor.getExpertise(), String[].class));
            }
        } catch (Exception e) {
            dto.setExpertise(new String[]{});
        }
        return dto;
    }
}
