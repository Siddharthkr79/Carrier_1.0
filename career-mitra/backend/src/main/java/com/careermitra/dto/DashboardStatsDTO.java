package com.careermitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalUsers;
    private Long totalMentors;
    private Long totalSessions;
    private Double totalRevenue;
    private Double platformEarnings;
}
