package com.edutrack.service;

import com.edutrack.dto.JwtResponse;
import com.edutrack.dto.LoginRequest;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
}
