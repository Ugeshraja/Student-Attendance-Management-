package com.edutrack.controller;

import com.edutrack.dto.PasswordChangeRequest;
import com.edutrack.dto.ProfileUpdateDTO;
import com.edutrack.entity.User;
import com.edutrack.exception.BadRequestException;
import com.edutrack.exception.ResourceNotFoundException;
import com.edutrack.repository.UserRepository;
import com.edutrack.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserRepository userRepository;

    @Value("${edutrack.upload.dir}")
    private String uploadDir;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole().name().equals("TEACHER")) {
            return ResponseEntity.ok(profileService.getTeacherProfile(principal.getName()));
        } else {
            return ResponseEntity.ok(profileService.getStudentProfile(principal.getName()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateDTO dto, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole().name().equals("TEACHER")) {
            return ResponseEntity.ok(profileService.updateTeacherProfile(principal.getName(), dto));
        } else {
            return ResponseEntity.ok(profileService.updateStudentProfile(principal.getName(), dto));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest request, Principal principal) {
        profileService.changePassword(principal.getName(), request);
        return ResponseEntity.ok().body("Password changed successfully");
    }

    @PostMapping("/picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file, Principal principal) {
        if (file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            // Ensure target directory exists
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Extract file extension
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // Create unique file name
            String fileName = user.getId() + "_" + System.currentTimeMillis() + extension;
            Path path = Paths.get(uploadDir + File.separator + fileName);
            Files.write(path, file.getBytes());

            // Save file relative path or filename in DB
            String fileUrl = "/api/uploads/" + fileName;
            profileService.updateProfilePicture(principal.getName(), fileUrl, user.getRole().name());

            Map<String, String> response = new HashMap<>();
            response.put("profilePictureUrl", fileUrl);
            response.put("message", "Profile picture updated successfully");
            
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new BadRequestException("Could not upload file: " + e.getMessage());
        }
    }
}
