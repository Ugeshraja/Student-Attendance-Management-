package com.edutrack.controller;

import com.edutrack.dto.AttendanceReportDTO;
import com.edutrack.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/class")
    public ResponseEntity<AttendanceReportDTO> getClassWiseReport(
            @RequestParam("classId") Integer classId,
            @RequestParam("sectionId") Integer sectionId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        AttendanceReportDTO report = reportService.getClassWiseReport(classId, sectionId, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<AttendanceReportDTO> getStudentWiseReport(
            @PathVariable("id") Long id,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        AttendanceReportDTO report = reportService.getStudentWiseReport(id, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/student/me")
    public ResponseEntity<AttendanceReportDTO> getMyReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Principal principal) {

        AttendanceReportDTO report = reportService.getStudentWiseReportByUsername(principal.getName(), startDate, endDate);
        return ResponseEntity.ok(report);
    }
}
