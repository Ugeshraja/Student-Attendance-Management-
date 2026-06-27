package com.edutrack.mapper;

import com.edutrack.dto.AttendanceDTO;
import com.edutrack.dto.StudentDTO;
import com.edutrack.dto.TeacherDTO;
import com.edutrack.entity.Attendance;
import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;

public class EduMapper {

    public static StudentDTO toStudentDTO(Student student) {
        if (student == null) return null;
        
        return StudentDTO.builder()
                .id(student.getId())
                .rollNumber(student.getRollNumber())
                .name(student.getName())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .classId(student.getClassEntity() != null ? student.getClassEntity().getId() : null)
                .className(student.getClassEntity() != null ? student.getClassEntity().getName() : null)
                .sectionId(student.getSection() != null ? student.getSection().getId() : null)
                .sectionName(student.getSection() != null ? student.getSection().getName() : null)
                .parentName(student.getParentName())
                .parentMobile(student.getParentMobile())
                .email(student.getEmail())
                .address(student.getAddress())
                .username(student.getUser() != null ? student.getUser().getUsername() : null)
                .profilePicture(student.getProfilePicture())
                .teacherId(student.getTeacher() != null ? student.getTeacher().getId() : null)
                .teacherName(student.getTeacher() != null ? student.getTeacher().getName() : null)
                .build();
    }

    public static TeacherDTO toTeacherDTO(Teacher teacher) {
        if (teacher == null) return null;

        return TeacherDTO.builder()
                .id(teacher.getId())
                .name(teacher.getName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .profilePicture(teacher.getProfilePicture())
                .username(teacher.getUser() != null ? teacher.getUser().getUsername() : null)
                .build();
    }

    public static AttendanceDTO toAttendanceDTO(Attendance attendance) {
        if (attendance == null) return null;

        return AttendanceDTO.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentRollNumber(attendance.getStudent().getRollNumber())
                .studentName(attendance.getStudent().getName())
                .date(attendance.getDate())
                .status(attendance.getStatus().name())
                .remarks(attendance.getRemarks())
                .build();
    }
}
