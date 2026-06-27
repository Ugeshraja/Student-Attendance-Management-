package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String role;
    private String name;
    private String profilePicture;
    
    // Student specific fields if role is STUDENT
    private Integer classId;
    private String className;
    private Integer sectionId;
    private String sectionName;
}
