package com.edutrack.repository;

import com.edutrack.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {
    Optional<ClassEntity> findByName(String name);
}
