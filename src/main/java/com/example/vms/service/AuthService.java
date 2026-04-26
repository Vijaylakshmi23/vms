package com.example.vms.service;

import com.example.vms.dto.request.LoginRequest;
import com.example.vms.dto.request.RegisterRequest;
import com.example.vms.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
