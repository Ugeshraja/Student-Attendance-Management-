package com.edutrack.service;

import com.edutrack.dto.PasswordChangeRequest;
import com.edutrack.dto.ProfileUpdateDTO;
import com.edutrack.dto.StudentDTO;
import com.edutrack.dto.TeacherDTO;

public interface ProfileService {
    TeacherDTO getTeacherProfile(String username);
    StudentDTO getStudentProfile(String username);
    TeacherDTO updateTeacherProfile(String username, ProfileUpdateDTO dto);
    StudentDTO updateStudentProfile(String username, ProfileUpdateDTO dto);
    void changePassword(String username, PasswordChangeRequest request);
    void updateProfilePicture(String username, String filename, String role);
}
