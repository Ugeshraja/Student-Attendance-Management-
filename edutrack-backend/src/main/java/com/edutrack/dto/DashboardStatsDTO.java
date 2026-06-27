package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalStudents;
    private long presentToday;
    private long absentToday;
    private long leaveToday;
    private double attendancePercentage;
    private LocalDate todayDate;
    
    private List<AttendanceDTO> recentActivity;
}
