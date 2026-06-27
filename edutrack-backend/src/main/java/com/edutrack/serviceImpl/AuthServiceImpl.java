package com.edutrack.serviceImpl;

import com.edutrack.dto.JwtResponse;
import com.edutrack.dto.LoginRequest;
import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;
import com.edutrack.entity.User;
import com.edutrack.exception.BadRequestException;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import com.edutrack.repository.UserRepository;
import com.edutrack.security.JwtUtils;
import com.edutrack.security.UserDetailsImpl;
import com.edutrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        // Retrieve the user to verify if they exist and check the role early
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        // Match case-insensitive or exact role
        if (!user.getRole().name().equalsIgnoreCase(loginRequest.getRole())) {
            throw new BadRequestException("Role mismatch for the given username");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        JwtResponse.JwtResponseBuilder builder = JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .role(user.getRole().name());

        if (user.getRole().name().equals("TEACHER")) {
            Optional<Teacher> teacherOpt = teacherRepository.findByUserId(user.getId());
            if (teacherOpt.isPresent()) {
                Teacher teacher = teacherOpt.get();
                builder.name(teacher.getName())
                       .profilePicture(teacher.getProfilePicture());
            } else {
                builder.name("Teacher");
            }
        } else if (user.getRole().name().equals("STUDENT")) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                builder.name(student.getName())
                       .profilePicture(student.getProfilePicture());
                if (student.getClassEntity() != null) {
                    builder.classId(student.getClassEntity().getId())
                           .className(student.getClassEntity().getName());
                }
                if (student.getSection() != null) {
                    builder.sectionId(student.getSection().getId())
                           .sectionName(student.getSection().getName());
                }
            } else {
                builder.name("Student");
            }
        }

        return builder.build();
    }
}
