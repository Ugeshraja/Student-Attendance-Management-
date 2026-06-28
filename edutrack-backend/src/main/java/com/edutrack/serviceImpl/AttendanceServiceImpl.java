package com.edutrack.serviceImpl;

import com.edutrack.dto.*;
import com.edutrack.entity.*;
import com.edutrack.exception.BadRequestException;
import com.edutrack.exception.ResourceNotFoundException;
import com.edutrack.mapper.EduMapper;
import com.edutrack.repository.AttendanceRepository;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import com.edutrack.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public List<AttendanceDTO> getAttendanceForClassSectionDate(Integer classId, Integer sectionId, LocalDate date) {
        List<Student> students = studentRepository.findByClassEntityIdAndSectionId(classId, sectionId);
        
        List<AttendanceDTO> dtoList = new ArrayList<>();
        for (Student student : students) {
            Optional<Attendance> attendanceOpt = attendanceRepository.findByStudentIdAndDate(student.getId(), date);
            if (attendanceOpt.isPresent()) {
                dtoList.add(EduMapper.toAttendanceDTO(attendanceOpt.get()));
            } else {
                // If no record exists, create a default template (status null so UI can choose)
                dtoList.add(AttendanceDTO.builder()
                        .studentId(student.getId())
                        .studentRollNumber(student.getRollNumber())
                        .studentName(student.getName())
                        .date(date)
                        .status(null)
                        .remarks(null)
                        .build());
            }
        }
        return dtoList;
    }

    @Override
    @Transactional
    public void saveAttendanceForClassSection(ClassAttendanceSubmitRequest request) {
        LocalDate date = request.getDate();
        
        for (AttendanceRecordRequest record : request.getRecords()) {
            Student student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + record.getStudentId()));

            AttendanceStatus status;
            try {
                status = AttendanceStatus.valueOf(record.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid attendance status: " + record.getStatus());
            }

            // Look up if attendance record already exists for the day
            Optional<Attendance> existingOpt = attendanceRepository.findByStudentIdAndDate(student.getId(), date);
            Attendance attendance;
            if (existingOpt.isPresent()) {
                attendance = existingOpt.get();
                attendance.setStatus(status);
                attendance.setRemarks(record.getRemarks());
            } else {
                attendance = Attendance.builder()
                        .student(student)
                        .date(date)
                        .status(status)
                        .remarks(record.getRemarks())
                        .build();
            }
            attendanceRepository.save(attendance);
        }
    }

    @Override
    public DashboardStatsDTO getTeacherDashboardStats(String teacherUsername) {
        Teacher teacher = teacherRepository.findByUserUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        long totalStudents = studentRepository.countByTeacherId(teacher.getId());
        LocalDate today = LocalDate.now();

        long presentToday = attendanceRepository.countByTeacherAndDateAndStatus(teacher.getId(), today, AttendanceStatus.PRESENT);
        long absentToday = attendanceRepository.countByTeacherAndDateAndStatus(teacher.getId(), today, AttendanceStatus.ABSENT);
        long leaveToday = attendanceRepository.countByTeacherAndDateAndStatus(teacher.getId(), today, AttendanceStatus.LEAVE);

        double percentage = 0.0;
        if (totalStudents > 0) {
            percentage = ((double) presentToday / totalStudents) * 100.0;
        }

        // Fetch recent activity (last 10 attendance records marked)
        List<Attendance> recentAttendance = attendanceRepository.findByTeacherAndDate(teacher.getId(), today);
        if (recentAttendance.isEmpty()) {
            // fallback to last date with data or empty
            recentAttendance = attendanceRepository.findByTeacherAndDate(teacher.getId(), today.minusDays(1));
        }

        List<AttendanceDTO> recentActivity = recentAttendance.stream()
                .limit(10)
                .map(EduMapper::toAttendanceDTO)
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalStudents(totalStudents)
                .presentToday(presentToday)
                .absentToday(absentToday)
                .leaveToday(leaveToday)
                .attendancePercentage(Math.round(percentage * 100.0) / 100.0) // Round to 2 decimal places
                .todayDate(today)
                .recentActivity(recentActivity)
                .build();
    }

    @Override
    public DashboardStatsDTO getStudentDashboardStats(String studentUsername) {
        Student student = studentRepository.findByUserUsername(studentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<Attendance> history = attendanceRepository.findByStudentId(student.getId());
        
        long totalDays = history.size();
        long presentCount = history.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long absentCount = history.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
        long leaveCount = history.stream().filter(a -> a.getStatus() == AttendanceStatus.LEAVE).count();

        double percentage = 100.0;
        if (totalDays > 0) {
            percentage = ((double) presentCount / totalDays) * 100.0;
        }

        return DashboardStatsDTO.builder()
                .totalStudents(1) // for alignment
                .presentToday(presentCount) // Map presentCount here
                .absentToday(absentCount)   // Map absentCount here
                .leaveToday(leaveCount)     // Map leaveCount here
                .attendancePercentage(Math.round(percentage * 100.0) / 100.0)
                .todayDate(LocalDate.now())
                .recentActivity(null)
                .build();
    }

    @Override
    public List<AttendanceDTO> getStudentAttendanceHistory(String studentUsername) {
        Student student = studentRepository.findByUserUsername(studentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return attendanceRepository.findByStudentId(student.getId()).stream()
                .map(EduMapper::toAttendanceDTO)
                .collect(Collectors.toList());
    }
}
