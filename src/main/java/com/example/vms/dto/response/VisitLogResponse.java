package com.example.vms.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VisitLogResponse {

    private Long id;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String status;
}