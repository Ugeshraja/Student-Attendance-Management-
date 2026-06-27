package com.edutrack.controller;

import com.edutrack.dto.AttendanceDTO;
import com.edutrack.dto.ClassAttendanceSubmitRequest;
import com.edutrack.dto.DashboardStatsDTO;
import com.edutrack.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceDTO>> getAttendanceSheet(
            @RequestParam("classId") Integer classId,
            @RequestParam("sectionId") Integer sectionId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<AttendanceDTO> sheet = attendanceService.getAttendanceForClassSectionDate(classId, sectionId, date);
        return ResponseEntity.ok(sheet);
    }

    @PostMapping
    public ResponseEntity<?> saveAttendance(@Valid @RequestBody ClassAttendanceSubmitRequest request) {
        attendanceService.saveAttendanceForClassSection(request);
        return ResponseEntity.ok().body("Attendance saved successfully");
    }

    @GetMapping("/student/stats")
    public ResponseEntity<DashboardStatsDTO> getStudentStats(Principal principal) {
        DashboardStatsDTO stats = attendanceService.getStudentDashboardStats(principal.getName());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/student/history")
    public ResponseEntity<List<AttendanceDTO>> getStudentHistory(Principal principal) {
        List<AttendanceDTO> history = attendanceService.getStudentAttendanceHistory(principal.getName());
        return ResponseEntity.ok(history);
    }
}
