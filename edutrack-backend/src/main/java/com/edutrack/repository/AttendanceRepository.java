package com.edutrack.repository;

import com.edutrack.entity.Attendance;
import com.edutrack.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByDate(LocalDate date);
    
    List<Attendance> findByStudentClassEntityIdAndStudentSectionIdAndDate(Integer classId, Integer sectionId, LocalDate date);
    
    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
    
    List<Attendance> findByStudentClassEntityIdAndStudentSectionIdAndDateBetween(Integer classId, Integer sectionId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = :status")
    long countByDateAndStatus(@Param("date") LocalDate date, @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a JOIN a.student s WHERE s.teacher.id = :teacherId AND a.date = :date AND a.status = :status")
    long countByTeacherAndDateAndStatus(@Param("teacherId") Long teacherId, @Param("date") LocalDate date, @Param("status") AttendanceStatus status);

    @Query("SELECT a FROM Attendance a JOIN a.student s WHERE s.teacher.id = :teacherId AND a.date = :date")
    List<Attendance> findByTeacherAndDate(@Param("teacherId") Long teacherId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Attendance a JOIN a.student s WHERE s.teacher.id = :teacherId AND a.date BETWEEN :startDate AND :endDate")
    List<Attendance> findByTeacherAndDateBetween(@Param("teacherId") Long teacherId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
