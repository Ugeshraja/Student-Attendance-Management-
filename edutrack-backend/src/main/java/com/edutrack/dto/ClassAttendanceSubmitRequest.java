package com.edutrack.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ClassAttendanceSubmitRequest {
    @NotNull(message = "Class ID is required")
    private Integer classId;

    @NotNull(message = "Section ID is required")
    private Integer sectionId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "Attendance records cannot be empty")
    private List<AttendanceRecordRequest> records;
}
