package com.example.vms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vms.entity.VisitLog;
import com.example.vms.service.VisitLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/visit-logs")
@RequiredArgsConstructor
public class VisitLogController {

    private final VisitLogService visitLogService;

    // ✅ Check-in
    @PostMapping("/checkin/{requestId}")
    public VisitLog checkIn(@PathVariable Long requestId) {
        return visitLogService.checkIn(requestId);
    }

    // ✅ Check-out
    @PutMapping("/checkout/{logId}")
    public VisitLog checkOut(@PathVariable Long logId) {
        return visitLogService.checkOut(logId);
    }

    // ✅ Get all logs
    @GetMapping
    public List<VisitLog> getAllLogs() {
        return visitLogService.getAllLogs();
    }

    // ✅ Get by ID
    @GetMapping("/{id}")
    public VisitLog getLogById(@PathVariable Long id) {
        return visitLogService.getLogById(id);
    }
}
