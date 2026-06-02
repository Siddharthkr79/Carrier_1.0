package com.careermitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorDTO {
    private Long id;
    private String name;
    private String bio;
    private String company;
    private String domain;
    private Integer yearsOfExperience;
    private Double sessionPrice;
    private String[] skills;
    private String[] expertise;
    private String photoUrl;
    private String linkedinUrl;
    private String supportiveDocumentUrl;
    private Double rating;
    private Integer reviewCount;
    private String status;
}
