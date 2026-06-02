package com.careermitra.controller;

import com.careermitra.dto.MentorDTO;
import com.careermitra.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.File;

@RestController
@RequestMapping("/api/mentors")
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class MentorController {
    @Autowired
    private MentorService mentorService;

    @Autowired
    private com.careermitra.service.AuthService authService;

    @Autowired
    private com.careermitra.repository.UserRepository userRepository;
    
    @Autowired
    private com.careermitra.repository.MentorRepository mentorRepository;

    @GetMapping
    public ResponseEntity<List<MentorDTO>> getAllMentors(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Double maxPrice) {
        
        List<MentorDTO> mentors;
        if (domain != null || minExperience != null || maxPrice != null) {
            mentors = mentorService.searchMentors(domain, minExperience, maxPrice);
        } else {
            mentors = mentorService.getApprovedMentors();
        }
        
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMentorById(@PathVariable Long id) {
        try {
            MentorDTO mentor = mentorService.getMentorById(id);
            return ResponseEntity.ok(mentor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getMentorProfile(@RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);
            MentorDTO mentor = mentorService.getMentorByUserId(userDto.getId());
            return ResponseEntity.ok(mentor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createMentor(@RequestBody MentorDTO dto, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);
            com.careermitra.entity.User user = userRepository.findById(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            MentorDTO created = mentorService.createMentor(dto, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMentor(@PathVariable Long id, @RequestBody MentorDTO dto) {
        try {
            MentorDTO updated = mentorService.updateMentor(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);

            com.careermitra.entity.Mentor mentor = mentorRepository.findByUserId(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("Mentor not found"));

            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("No file uploaded"));
            }

            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "mentors" + File.separator;
            File dir = new File(uploadsDir);
            if (!dir.exists()) dir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetPath = Paths.get(uploadsDir + filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String urlPath = "/uploads/mentors/" + filename;
            mentor.setPhotoUrl(urlPath);
            mentorRepository.save(mentor);

            return ResponseEntity.ok(new PhotoUploadResponse("Photo uploaded successfully", urlPath));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/upload-document")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            com.careermitra.dto.UserDTO userDto = authService.verifyToken(cleanToken);

            com.careermitra.entity.Mentor mentor = mentorRepository.findByUserId(userDto.getId())
                    .orElseThrow(() -> new RuntimeException("Mentor not found"));

            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("No file uploaded"));
            }

            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "mentors" + File.separator;
            File dir = new File(uploadsDir);
            if (!dir.exists()) dir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetPath = Paths.get(uploadsDir + filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String urlPath = "/uploads/mentors/" + filename;
            mentor.setSupportiveDocumentUrl(urlPath);
            mentorRepository.save(mentor);

            return ResponseEntity.ok(new DocumentUploadResponse("Document uploaded successfully", urlPath));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}

class PhotoUploadResponse {
    public String message;
    public String photoUrl;

    public PhotoUploadResponse(String message, String photoUrl) {
        this.message = message;
        this.photoUrl = photoUrl;
    }
}

class DocumentUploadResponse {
    public String message;
    public String supportiveDocumentUrl;

    public DocumentUploadResponse(String message, String supportiveDocumentUrl) {
        this.message = message;
        this.supportiveDocumentUrl = supportiveDocumentUrl;
    }
}

