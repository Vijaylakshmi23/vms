package com.example.vms.service;

import com.example.vms.dto.request.VisitRequestDTO;
import com.example.vms.entity.VisitRequest;

import java.util.List;

public interface VisitRequestService {

    // FIX: createRequest now takes DTO, not raw entity
    VisitRequest createRequest(VisitRequestDTO dto);

    List<VisitRequest> getAllRequests();

    VisitRequest getRequestById(Long id);

    VisitRequest approveRequest(Long id);

    VisitRequest rejectRequest(Long id);
}