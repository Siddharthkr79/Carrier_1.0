package com.careermitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    @JsonProperty("isRegistered")
    private boolean isRegistered;
}
