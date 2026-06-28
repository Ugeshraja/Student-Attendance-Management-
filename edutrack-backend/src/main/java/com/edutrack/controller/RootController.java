package com.edutrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> rootEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ONLINE");
        response.put("message", "Welcome to the EduTrack Attendance API System.");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}
