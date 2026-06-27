package com.edutrack.serviceImpl;

import com.edutrack.dto.StudentDTO;
import com.edutrack.entity.*;
import com.edutrack.exception.BadRequestException;
import com.edutrack.exception.DuplicateRecordException;
import com.edutrack.exception.ResourceNotFoundException;
import com.edutrack.mapper.EduMapper;
import com.edutrack.repository.*;
import com.edutrack.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StudentDTO addStudent(StudentDTO studentDTO, String teacherUsername) {
        // Validate unique username
        if (userRepository.existsByUsername(studentDTO.getUsername())) {
            throw new DuplicateRecordException("Username already exists: " + studentDTO.getUsername());
        }

        // Validate unique roll number
        if (studentRepository.existsByRollNumber(studentDTO.getRollNumber())) {
            throw new DuplicateRecordException("Roll number already exists: " + studentDTO.getRollNumber());
        }

        // Validate unique email
        if (studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new DuplicateRecordException("Email already exists: " + studentDTO.getEmail());
        }

        if (studentDTO.getPassword() == null || studentDTO.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Password is required for creating a new student");
        }

        // Retrieve Class and Section
        ClassEntity classEntity = classRepository.findById(studentDTO.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + studentDTO.getClassId()));

        Section section = sectionRepository.findById(studentDTO.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + studentDTO.getSectionId()));

        // Retrieve Teacher
        Teacher teacher = teacherRepository.findByUserUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found for user: " + teacherUsername));

        // Create User entity
        User user = User.builder()
                .username(studentDTO.getUsername().trim())
                .password(passwordEncoder.encode(studentDTO.getPassword()))
                .role(Role.STUDENT)
                .enabled(true)
                .build();

        // Create Student entity
        Student student = Student.builder()
                .user(user)
                .rollNumber(studentDTO.getRollNumber().trim().toUpperCase())
                .name(studentDTO.getName().trim())
                .gender(studentDTO.getGender())
                .dateOfBirth(studentDTO.getDateOfBirth())
                .classEntity(classEntity)
                .section(section)
                .parentName(studentDTO.getParentName().trim())
                .parentMobile(studentDTO.getParentMobile().trim())
                .email(studentDTO.getEmail().trim().toLowerCase())
                .address(studentDTO.getAddress())
                .profilePicture(studentDTO.getProfilePicture())
                .teacher(teacher)
                .build();

        Student savedStudent = studentRepository.save(student);
        return EduMapper.toStudentDTO(savedStudent);
    }

    @Override
    @Transactional
    public StudentDTO editStudent(Long studentId, StudentDTO studentDTO) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Check if Roll number changed and is unique
        if (!student.getRollNumber().equalsIgnoreCase(studentDTO.getRollNumber()) &&
                studentRepository.existsByRollNumber(studentDTO.getRollNumber())) {
            throw new DuplicateRecordException("Roll number already exists: " + studentDTO.getRollNumber());
        }

        // Check if Email changed and is unique
        if (!student.getEmail().equalsIgnoreCase(studentDTO.getEmail()) &&
                studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new DuplicateRecordException("Email already exists: " + studentDTO.getEmail());
        }

        // Retrieve Class and Section
        ClassEntity classEntity = classRepository.findById(studentDTO.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + studentDTO.getClassId()));

        Section section = sectionRepository.findById(studentDTO.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + studentDTO.getSectionId()));

        // Update Student fields
        student.setRollNumber(studentDTO.getRollNumber().trim().toUpperCase());
        student.setName(studentDTO.getName().trim());
        student.setGender(studentDTO.getGender());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setClassEntity(classEntity);
        student.setSection(section);
        student.setParentName(studentDTO.getParentName().trim());
        student.setParentMobile(studentDTO.getParentMobile().trim());
        student.setEmail(studentDTO.getEmail().trim().toLowerCase());
        student.setAddress(studentDTO.getAddress());
        
        // Update user username if it changed
        User user = student.getUser();
        if (!user.getUsername().equalsIgnoreCase(studentDTO.getUsername())) {
            if (userRepository.existsByUsername(studentDTO.getUsername())) {
                throw new DuplicateRecordException("Username already exists: " + studentDTO.getUsername());
            }
            user.setUsername(studentDTO.getUsername().trim());
        }

        // Save
        Student updatedStudent = studentRepository.save(student);
        return EduMapper.toStudentDTO(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        // Deleting student will delete user via CascadeType.ALL
        studentRepository.delete(student);
    }

    @Override
    public StudentDTO getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return EduMapper.toStudentDTO(student);
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(EduMapper::toStudentDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getStudentsByTeacher(String teacherUsername) {
        Teacher teacher = teacherRepository.findByUserUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        return studentRepository.findByTeacherId(teacher.getId()).stream()
                .map(EduMapper::toStudentDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> searchStudents(String query) {
        return studentRepository.findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(query, query)
                .stream()
                .map(EduMapper::toStudentDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getStudentsByClassAndSection(Integer classId, Integer sectionId) {
        return studentRepository.findByClassEntityIdAndSectionId(classId, sectionId).stream()
                .map(EduMapper::toStudentDTO)
                .collect(Collectors.toList());
    }
}
