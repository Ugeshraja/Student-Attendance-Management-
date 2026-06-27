package com.edutrack;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;

@SpringBootApplication
public class EduTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduTrackApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            TeacherRepository teacherRepository,
            StudentRepository studentRepository,
            ClassRepository classRepository,
            SectionRepository sectionRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Classes if empty
            if (classRepository.count() == 0) {
                classRepository.save(ClassEntity.builder().name("Class 10").build());
                classRepository.save(ClassEntity.builder().name("Class 11").build());
                classRepository.save(ClassEntity.builder().name("Class 12").build());
            }

            // Seed Sections if empty
            if (sectionRepository.count() == 0) {
                sectionRepository.save(Section.builder().name("Section A").build());
                sectionRepository.save(Section.builder().name("Section B").build());
                sectionRepository.save(Section.builder().name("Section C").build());
            }

            // Seed Default Teacher User if empty
            if (!userRepository.existsByUsername("teacher1")) {
                User teacherUser = User.builder()
                        .username("teacher1")
                        .password(passwordEncoder.encode("Password123"))
                        .role(Role.TEACHER)
                        .enabled(true)
                        .build();
                userRepository.save(teacherUser);

                Teacher teacher = Teacher.builder()
                        .user(teacherUser)
                        .name("Prof. Sarah Jenkins")
                        .email("sarah.jenkins@edutrack.edu")
                        .phone("+15550198")
                        .profilePicture(null)
                        .build();
                teacherRepository.save(teacher);
            }

            // Seed Default Student User if empty
            if (!userRepository.existsByUsername("student1")) {
                User studentUser = User.builder()
                        .username("student1")
                        .password(passwordEncoder.encode("Password123"))
                        .role(Role.STUDENT)
                        .enabled(true)
                        .build();
                userRepository.save(studentUser);

                ClassEntity class10 = classRepository.findByName("Class 10").orElse(null);
                Section secA = sectionRepository.findByName("Section A").orElse(null);
                Teacher teacher = teacherRepository.findById(1L).orElse(null);

                Student student = Student.builder()
                        .user(studentUser)
                        .rollNumber("STU1001")
                        .name("Alex Mercer")
                        .gender("Male")
                        .dateOfBirth(LocalDate.of(2010, 5, 15))
                        .classEntity(class10)
                        .section(secA)
                        .parentName("Richard Mercer")
                        .parentMobile("+15550199")
                        .email("alex.mercer@edutrack.edu")
                        .address("123 Maple Street, Springfield")
                        .profilePicture(null)
                        .teacher(teacher)
                        .build();
                studentRepository.save(student);
            }
        };
    }
}
