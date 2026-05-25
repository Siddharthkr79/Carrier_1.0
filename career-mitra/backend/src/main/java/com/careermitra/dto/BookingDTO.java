package com.careermitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long mentorId;
    private String mentorName;
    private String sessionDate;
    private String timeSlot;
    private String topic;
    private String description;
    private Double amount;
    private String status;
    private String meetingLink;
}
