package com.example.vms.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.vms.dto.request.VisitRequestDTO;
import com.example.vms.entity.User;
import com.example.vms.entity.VisitRequest;
import com.example.vms.entity.VisitStatus;
import com.example.vms.entity.Visitor;
import com.example.vms.repository.UserRepository;
import com.example.vms.repository.VisitRequestRepository;
import com.example.vms.repository.VisitorRepository;
import com.example.vms.service.VisitRequestService;
import com.example.vms.util.QRCodeGenerator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VisitRequestServiceImpl implements VisitRequestService {

    private final VisitRequestRepository visitRequestRepository;
    private final VisitorRepository visitorRepository;
    private final UserRepository userRepository;

    @Override
    public VisitRequest createRequest(VisitRequestDTO dto) {
        // FIX: Resolve visitor and host from IDs — clean DTO-based approach
        Visitor visitor = visitorRepository.findById(dto.getVisitorId())
                .orElseThrow(() -> new RuntimeException("Visitor not found with id: " + dto.getVisitorId()));

        User host = userRepository.findById(dto.getHostId())
                .orElseThrow(() -> new RuntimeException("Host (User) not found with id: " + dto.getHostId()));

        VisitRequest request = VisitRequest.builder()
                .purpose(dto.getPurpose())
                .visitDate(dto.getVisitDate())
                .visitor(visitor)
                .host(host)
                .status(VisitStatus.PENDING)
                .build();

        return visitRequestRepository.save(request);
    }

    @Override
    public List<VisitRequest> getAllRequests() {
        return visitRequestRepository.findAll();
    }

    @Override
    public VisitRequest getRequestById(Long id) {
        return visitRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    @Override
    public VisitRequest approveRequest(Long id) {
        VisitRequest req = visitRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus(VisitStatus.APPROVED);

        // Generate QR code containing visit details
        try {
            String qrContent = String.format(
                    "VisitID:%d | Visitor:%s | Host:%s | Date:%s | Purpose:%s",
                    req.getId(),
                    req.getVisitor().getName(),
                    req.getHost().getName(),
                    req.getVisitDate().toString(),
                    req.getPurpose()
            );
            String qrBase64 = QRCodeGenerator.generateQRCodeBase64(qrContent);
            req.setQrCode(qrBase64);
        } catch (Exception e) {
            // Log but don't fail the approval if QR generation fails
            System.err.println("QR generation failed: " + e.getMessage());
        }

        return visitRequestRepository.save(req);
    }

    @Override
    public VisitRequest rejectRequest(Long id) {
        VisitRequest req = visitRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus(VisitStatus.REJECTED);
        return visitRequestRepository.save(req);
    }
}
