package com.edutrack.service;

import com.edutrack.dto.AttendanceDTO;
import com.edutrack.dto.ClassAttendanceSubmitRequest;
import com.edutrack.dto.DashboardStatsDTO;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceDTO> getAttendanceForClassSectionDate(Integer classId, Integer sectionId, LocalDate date);
    void saveAttendanceForClassSection(ClassAttendanceSubmitRequest request);
    DashboardStatsDTO getTeacherDashboardStats(String teacherUsername);
    DashboardStatsDTO getStudentDashboardStats(String studentUsername);
    List<AttendanceDTO> getStudentAttendanceHistory(String studentUsername);
}
