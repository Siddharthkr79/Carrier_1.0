package com.careermitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebinarDTO {
    private Long id;
    private String title;
    private String description;
    private Long mentorId;
    private String mentorName;
    private String sessionDate;
    private String timeSlot;
    private Double price;
    private Integer capacityLimit;
    private Integer registeredCount;
    private String status;
    private String meetingLink;
    private boolean isRegistered;
}
