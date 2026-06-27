package com.edutrack.repository;

import com.edutrack.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserUsername(String username);
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByRollNumber(String rollNumber);
    Boolean existsByRollNumber(String rollNumber);
    Boolean existsByEmail(String email);
    
    List<Student> findByClassEntityIdAndSectionId(Integer classId, Integer sectionId);
    List<Student> findByTeacherId(Long teacherId);
    
    long countByTeacherId(Long teacherId);
    
    // Add custom search functionality
    List<Student> findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(String name, String rollNumber);
}
