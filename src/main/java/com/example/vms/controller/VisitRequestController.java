package com.example.vms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vms.dto.request.VisitRequestDTO;
import com.example.vms.entity.VisitRequest;
import com.example.vms.service.VisitRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/visit-requests")
@RequiredArgsConstructor
public class VisitRequestController {

    private final VisitRequestService visitRequestService;

    // FIX: Now accepts VisitRequestDTO instead of raw VisitRequest entity.
    // Body: { "purpose": "Meeting", "visitDate": "2026-04-25T10:00:00", "visitorId": 1, "hostId": 2 }
    @PostMapping("/request")
    public VisitRequest createRequest(@RequestBody VisitRequestDTO dto) {
        return visitRequestService.createRequest(dto);
    }

    @GetMapping
    public List<VisitRequest> getAllRequests() {
        return visitRequestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public VisitRequest getRequestById(@PathVariable Long id) {
        return visitRequestService.getRequestById(id);
    }

    @PutMapping("/approve/{id}")
    public VisitRequest approve(@PathVariable Long id) {
        return visitRequestService.approveRequest(id);
    }

    @PutMapping("/reject/{id}")
    public VisitRequest reject(@PathVariable Long id) {
        return visitRequestService.rejectRequest(id);
    }
}