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

    @Autowired
    private EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new UnauthorizedException("Your account is blocked. Please contact support.");
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
            student = studentRepository.save(student);
            user.setStudent(student);
        } else {
            Mentor mentor = new Mentor();
            mentor.setUser(user);
            mentor = mentorRepository.save(mentor);
            user.setMentor(mentor);
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

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new UnauthorizedException("Your account is blocked. Please contact support.");
        }

        return modelMapper.map(user, UserDTO.class);
    }

    public void forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = java.util.UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        }
    }

    public void resetPassword(String token, String newPassword) {
        if (token == null || token.isEmpty()) {
            throw new BadRequestException("Token is required");
        }
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
