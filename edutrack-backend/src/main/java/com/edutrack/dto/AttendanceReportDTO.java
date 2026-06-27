package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceReportDTO {
    private String type; // CLASS_WISE, STUDENT_WISE
    private String name; // Student Name or Class-Section Name
    private String rollNumber; // For student report
    private long totalDays;
    private long presentCount;
    private long absentCount;
    private long leaveCount;
    private double attendancePercentage;
    
    private List<AttendanceDTO> details;
}
