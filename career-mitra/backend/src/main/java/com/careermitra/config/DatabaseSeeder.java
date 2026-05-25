package com.careermitra.config;

import com.careermitra.entity.*;
import com.careermitra.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        // 1. Seed Admin
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@careermitra.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(UserRole.ADMIN);
        admin.setIsActive(true);
        userRepository.save(admin);

        // 2. Seed Student
        User studentUser = new User();
        studentUser.setName("Aarav Sharma");
        studentUser.setEmail("student@careermitra.com");
        studentUser.setPassword(passwordEncoder.encode("student123"));
        studentUser.setRole(UserRole.STUDENT);
        studentUser.setIsActive(true);
        studentUser = userRepository.save(studentUser);

        Student student = new Student();
        student.setUser(studentUser);
        studentRepository.save(student);

        // 3. Seed Mentors
        seedMentor("Dr. Rajesh Kumar", "rajesh@careermitra.com", "mentor123",
                "Over 15 years of experience in Software Architecture, AI/ML, and Tech Leadership. Ex-Google, Ex-Microsoft.",
                "Google", "Software Engineering", 15, 1000.0,
                "[\"Java\", \"Spring Boot\", \"System Design\", \"Kubernetes\"]",
                "[\"System Design\", \"Cloud Architecture\"]");

        seedMentor("Neha Sharma", "neha@careermitra.com", "mentor123",
                "Product Manager with 8+ years of experience leading cross-functional teams in fintech and e-commerce.",
                "Amazon", "Product Management", 8, 800.0,
                "[\"Product Strategy\", \"Agile\", \"Roadmap\", \"User Research\"]",
                "[\"Product Management\", \"Career Advice\"]");

        seedMentor("Amit Patel", "amit@careermitra.com", "mentor123",
                "Data Science Lead specialized in Deep Learning, NLP, and Recommendation Systems. Mentor to 50+ students.",
                "Meta", "Data Science", 10, 1200.0,
                "[\"Python\", \"PyTorch\", \"SQL\", \"Machine Learning\"]",
                "[\"Data Science\", \"Machine Learning\"]");
    }

    private void seedMentor(String name, String email, String password,
                            String bio, String company, String domain,
                            int experience, double price, String skills, String expertise) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(UserRole.MENTOR);
        user.setIsActive(true);
        user = userRepository.save(user);

        Mentor mentor = new Mentor();
        mentor.setUser(user);
        mentor.setBio(bio);
        mentor.setCompany(company);
        mentor.setDomain(domain);
        mentor.setYearsOfExperience(experience);
        mentor.setSessionPrice(price);
        mentor.setSkills(skills);
        mentor.setExpertise(expertise);
        mentor.setStatus(MentorStatus.APPROVED);
        mentor.setRating(4.5);
        mentor.setReviewCount(0);
        mentor = mentorRepository.save(mentor);

        // Add availability slots
        for (SlotDayOfWeek day : Arrays.asList(SlotDayOfWeek.MONDAY, SlotDayOfWeek.WEDNESDAY, SlotDayOfWeek.FRIDAY)) {
            AvailabilitySlot slot1 = new AvailabilitySlot();
            slot1.setMentor(mentor);
            slot1.setDayOfWeek(day);
            slot1.setStartTime("09:00");
            slot1.setEndTime("10:00");
            availabilitySlotRepository.save(slot1);

            AvailabilitySlot slot2 = new AvailabilitySlot();
            slot2.setMentor(mentor);
            slot2.setDayOfWeek(day);
            slot2.setStartTime("14:00");
            slot2.setEndTime("15:00");
            availabilitySlotRepository.save(slot2);
        }
    }
}
