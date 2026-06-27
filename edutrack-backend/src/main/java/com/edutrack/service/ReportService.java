package com.edutrack.service;

import com.edutrack.dto.AttendanceReportDTO;
import java.time.LocalDate;

public interface ReportService {
    AttendanceReportDTO getClassWiseReport(Integer classId, Integer sectionId, LocalDate startDate, LocalDate endDate);
    AttendanceReportDTO getStudentWiseReport(Long studentId, LocalDate startDate, LocalDate endDate);
    AttendanceReportDTO getStudentWiseReportByUsername(String username, LocalDate startDate, LocalDate endDate);
}
