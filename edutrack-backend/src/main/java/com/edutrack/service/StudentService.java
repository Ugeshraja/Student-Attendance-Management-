package com.edutrack.service;

import com.edutrack.dto.StudentDTO;
import java.util.List;

public interface StudentService {
    StudentDTO addStudent(StudentDTO studentDTO, String teacherUsername);
    StudentDTO editStudent(Long studentId, StudentDTO studentDTO);
    void deleteStudent(Long studentId);
    StudentDTO getStudentById(Long studentId);
    List<StudentDTO> getAllStudents();
    List<StudentDTO> getStudentsByTeacher(String teacherUsername);
    List<StudentDTO> searchStudents(String query);
    List<StudentDTO> getStudentsByClassAndSection(Integer classId, Integer sectionId);
}
