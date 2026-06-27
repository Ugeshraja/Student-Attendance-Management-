package com.edutrack.repository;

import com.edutrack.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserUsername(String username);
    Optional<Teacher> findByUserId(Long userId);
    Optional<Teacher> findByEmail(String email);
    Boolean existsByEmail(String email);
}
