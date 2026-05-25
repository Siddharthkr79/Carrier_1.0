package com.careermitra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "webinars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Webinar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "mentor_id", nullable = false)
    private Long mentorId;

    @Column(name = "mentor_name")
    private String mentorName;

    @Column(name = "session_date")
    private String sessionDate;

    @Column(name = "time_slot")
    private String timeSlot;

    @Column(name = "price")
    private Double price;

    @Column(name = "capacity_limit")
    private Integer capacityLimit;

    @Column(name = "registered_count")
    private Integer registeredCount = 0;

    @Column(name = "status")
    private String status = "UPCOMING"; // UPCOMING, ACTIVE, COMPLETED, CANCELLED

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
