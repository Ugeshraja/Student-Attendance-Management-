package com.edutrack.serviceImpl;

import com.edutrack.dto.AttendanceDTO;
import com.edutrack.dto.AttendanceReportDTO;
import com.edutrack.entity.*;
import com.edutrack.exception.ResourceNotFoundException;
import com.edutrack.mapper.EduMapper;
import com.edutrack.repository.AttendanceRepository;
import com.edutrack.repository.ClassRepository;
import com.edutrack.repository.SectionRepository;
import com.edutrack.repository.StudentRepository;
import com.edutrack.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Override
    public AttendanceReportDTO getClassWiseReport(Integer classId, Integer sectionId, LocalDate startDate, LocalDate endDate) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        List<Attendance> records = attendanceRepository.findByStudentClassEntityIdAndStudentSectionIdAndDateBetween(
                classId, sectionId, startDate, endDate);

        long totalDays = records.size();
        long presentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long absentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();
        long leaveCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.LEAVE).count();

        double percentage = 100.0;
        if (totalDays > 0) {
            percentage = ((double) presentCount / totalDays) * 100.0;
        }

        List<AttendanceDTO> details = records.stream()
                .map(EduMapper::toAttendanceDTO)
                .collect(Collectors.toList());

        return AttendanceReportDTO.builder()
                .type("CLASS_WISE")
                .name(classEntity.getName() + " - " + section.getName())
                .totalDays(totalDays)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .leaveCount(leaveCount)
                .attendancePercentage(Math.round(percentage * 100.0) / 100.0)
                .details(details)
                .build();
    }

    @Override
    public AttendanceReportDTO getStudentWiseReport(Long studentId, LocalDate startDate, LocalDate endDate) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return generateStudentReport(student, startDate, endDate);
    }

    @Override
    public AttendanceReportDTO getStudentWiseReportByUsername(String username, LocalDate startDate, LocalDate endDate) {
        Student student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return generateStudentReport(student, startDate, endDate);
    }

    private AttendanceReportDTO generateStudentReport(Student student, LocalDate startDate, LocalDate endDate) {
        List<Attendance> records = attendanceRepository.findByStudentIdAndDateBetween(
                student.getId(), startDate, endDate);

        long totalDays = records.size();
        long presentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long absentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();
        long leaveCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.LEAVE).count();

        double percentage = 100.0;
        if (totalDays > 0) {
            percentage = ((double) presentCount / totalDays) * 100.0;
        }

        List<AttendanceDTO> details = records.stream()
                .map(EduMapper::toAttendanceDTO)
                .collect(Collectors.toList());

        return AttendanceReportDTO.builder()
                .type("STUDENT_WISE")
                .name(student.getName())
                .rollNumber(student.getRollNumber())
                .totalDays(totalDays)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .leaveCount(leaveCount)
                .attendancePercentage(Math.round(percentage * 100.0) / 100.0)
                .details(details)
                .build();
    }
}
