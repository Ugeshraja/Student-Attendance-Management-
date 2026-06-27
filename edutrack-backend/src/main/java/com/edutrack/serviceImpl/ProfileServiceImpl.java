package com.edutrack.serviceImpl;

import com.edutrack.dto.PasswordChangeRequest;
import com.edutrack.dto.ProfileUpdateDTO;
import com.edutrack.dto.StudentDTO;
import com.edutrack.dto.TeacherDTO;
import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;
import com.edutrack.entity.User;
import com.edutrack.exception.BadRequestException;
import com.edutrack.exception.DuplicateRecordException;
import com.edutrack.exception.ResourceNotFoundException;
import com.edutrack.mapper.EduMapper;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import com.edutrack.repository.UserRepository;
import com.edutrack.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public TeacherDTO getTeacherProfile(String username) {
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found for username: " + username));
        return EduMapper.toTeacherDTO(teacher);
    }

    @Override
    public StudentDTO getStudentProfile(String username) {
        Student student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for username: " + username));
        return EduMapper.toStudentDTO(student);
    }

    @Override
    @Transactional
    public TeacherDTO updateTeacherProfile(String username, ProfileUpdateDTO dto) {
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));

        if (!teacher.getEmail().equalsIgnoreCase(dto.getEmail()) &&
                teacherRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateRecordException("Email already in use: " + dto.getEmail());
        }

        teacher.setName(dto.getName().trim());
        teacher.setEmail(dto.getEmail().trim().toLowerCase());
        teacher.setPhone(dto.getPhone() != null ? dto.getPhone().trim() : null);

        Teacher updated = teacherRepository.save(teacher);
        return EduMapper.toTeacherDTO(updated);
    }

    @Override
    @Transactional
    public StudentDTO updateStudentProfile(String username, ProfileUpdateDTO dto) {
        Student student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (!student.getEmail().equalsIgnoreCase(dto.getEmail()) &&
                studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateRecordException("Email already in use: " + dto.getEmail());
        }

        student.setName(dto.getName().trim());
        student.setEmail(dto.getEmail().trim().toLowerCase());
        student.setParentName(dto.getParentName() != null ? dto.getParentName().trim() : student.getParentName());
        student.setParentMobile(dto.getParentMobile() != null ? dto.getParentMobile().trim() : student.getParentMobile());
        student.setAddress(dto.getAddress() != null ? dto.getAddress().trim() : student.getAddress());

        Student updated = studentRepository.save(student);
        return EduMapper.toStudentDTO(updated);
    }

    @Override
    @Transactional
    public void changePassword(String username, PasswordChangeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPassword(passwordEncoder.encode(request.getNewPassword())); // Just a double check or simple set
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateProfilePicture(String username, String filename, String role) {
        if ("TEACHER".equalsIgnoreCase(role)) {
            Teacher teacher = teacherRepository.findByUserUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));
            teacher.setProfilePicture(filename);
            teacherRepository.save(teacher);
        } else if ("STUDENT".equalsIgnoreCase(role)) {
            Student student = studentRepository.findByUserUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
            student.setProfilePicture(filename);
            studentRepository.save(student);
        } else {
            throw new BadRequestException("Invalid role: " + role);
        }
    }
}
