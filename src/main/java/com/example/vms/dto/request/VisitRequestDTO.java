package com.example.vms.dto.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class VisitRequestDTO {

    private String purpose;
    private LocalDateTime visitDate;
    private Long visitorId;
    private Long hostId;
}
