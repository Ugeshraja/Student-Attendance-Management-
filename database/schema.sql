-- EduTrack Database Schema
-- MySQL 8.x

CREATE DATABASE IF NOT EXISTS edutrack_db;
USE edutrack_db;

-- 1. Create Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Sections Table
CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'TEACHER' or 'STUDENT'
    enabled BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    profile_picture VARCHAR(255),
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    class_id INT NOT NULL,
    section_id INT NOT NULL,
    parent_name VARCHAR(100),
    parent_mobile VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    profile_picture VARCHAR(255),
    teacher_id BIGINT,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_student_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE RESTRICT,
    CONSTRAINT fk_student_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    INDEX idx_roll_number (roll_number),
    INDEX idx_student_class_section (class_id, section_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL, -- 'PRESENT', 'ABSENT', 'LEAVE'
    remarks VARCHAR(255),
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_date (student_id, date),
    INDEX idx_attendance_date (date),
    INDEX idx_student_attendance (student_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert Classes
INSERT INTO classes (id, name) VALUES 
(1, 'Class 10'), 
(2, 'Class 11'), 
(3, 'Class 12')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Sections
INSERT INTO sections (id, name) VALUES 
(1, 'Section A'), 
(2, 'Section B'), 
(3, 'Section C')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Users (Password: Password123 hashed via BCrypt)
-- Hash: $2a$10$tMh4Hk9R4H5a5Zc6qK5uueaL0h/xM6r45Xk0J4hN58HhUoVdIePGu
INSERT INTO users (id, username, password, role, enabled) VALUES
(1, 'teacher1', '$2a$10$tMh4Hk9R4H5a5Zc6qK5uueaL0h/xM6r45Xk0J4hN58HhUoVdIePGu', 'TEACHER', TRUE),
(2, 'student1', '$2a$10$tMh4Hk9R4H5a5Zc6qK5uueaL0h/xM6r45Xk0J4hN58HhUoVdIePGu', 'STUDENT', TRUE)
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- Insert Teachers
INSERT INTO teachers (id, user_id, name, email, phone, profile_picture) VALUES
(1, 1, 'Prof. Sarah Jenkins', 'sarah.jenkins@edutrack.edu', '+15550198', NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email);

-- Insert Students
INSERT INTO students (id, user_id, roll_number, name, gender, date_of_birth, class_id, section_id, parent_name, parent_mobile, email, address, profile_picture, teacher_id) VALUES
(1, 2, 'STU1001', 'Alex Mercer', 'Male', '2010-05-15', 1, 1, 'Richard Mercer', '+15550199', 'alex.mercer@edutrack.edu', '123 Maple Street, Springfield', NULL, 1)
ON DUPLICATE KEY UPDATE roll_number=VALUES(roll_number), name=VALUES(name);
