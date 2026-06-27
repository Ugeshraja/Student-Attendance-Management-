package com.edutrack.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {
    private Long id;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotNull(message = "Class ID is required")
    private Integer classId;

    private String className;

    @NotNull(message = "Section ID is required")
    private Integer sectionId;

    private String sectionName;

    @NotBlank(message = "Parent name is required")
    private String parentName;

    @NotBlank(message = "Parent mobile number is required")
    @Pattern(regexp = "^\\+?[0-9\\-\\s]{7,15}$", message = "Invalid phone number format")
    private String parentMobile;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String address;

    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters")
    private String username;

    // Password is only validated during student creation, not updates
    private String password;

    private String profilePicture;

    private Long teacherId;
    private String teacherName;
}
