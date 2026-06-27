package com.edutrack.controller;

import com.edutrack.dto.DashboardStatsDTO;
import com.edutrack.dto.StudentDTO;
import com.edutrack.service.AttendanceService;
import com.edutrack.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/teacher")
public class TeacherController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Principal principal) {
        DashboardStatsDTO stats = attendanceService.getTeacherDashboardStats(principal.getName());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentDTO>> getStudents(Principal principal) {
        List<StudentDTO> students = studentService.getStudentsByTeacher(principal.getName());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PostMapping("/students")
    public ResponseEntity<StudentDTO> addStudent(@Valid @RequestBody StudentDTO studentDTO, Principal principal) {
        StudentDTO createdStudent = studentService.addStudent(studentDTO, principal.getName());
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<StudentDTO> editStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updatedStudent = studentService.editStudent(id, studentDTO);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok().body("Student deleted successfully");
    }

    @GetMapping("/students/search")
    public ResponseEntity<List<StudentDTO>> searchStudents(@RequestParam("query") String query) {
        List<StudentDTO> results = studentService.searchStudents(query);
        return ResponseEntity.ok(results);
    }
}
