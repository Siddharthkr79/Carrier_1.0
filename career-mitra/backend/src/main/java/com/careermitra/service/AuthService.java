package com.careermitra.service;

import com.careermitra.dto.*;
import com.careermitra.entity.*;
import com.careermitra.exception.BadRequestException;
import com.careermitra.exception.ResourceNotFoundException;
import com.careermitra.exception.UnauthorizedException;
import com.careermitra.repository.*;
import com.careermitra.security.JwtTokenProvider;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Authentication Service
 */
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ModelMapper modelMapper;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Generate token (simplified - normally would use Spring Security)
        String token = jwtTokenProvider.generateToken(user.getEmail());

        return new AuthResponse(token, modelMapper.map(user, UserDTO.class));
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().equalsIgnoreCase("MENTOR") ? UserRole.MENTOR : UserRole.STUDENT);
        user.setIsActive(true);

        user = userRepository.save(user);

        // Create corresponding student or mentor record
        if (user.getRole() == UserRole.STUDENT) {
            Student student = new Student();
            student.setUser(user);
            studentRepository.save(student);
        } else {
            Mentor mentor = new Mentor();
            mentor.setUser(user);
            mentorRepository.save(mentor);
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, modelMapper.map(user, UserDTO.class));
    }

    public UserDTO verifyToken(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Invalid token");
        }

        String email = jwtTokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return modelMapper.map(user, UserDTO.class);
    }
}
