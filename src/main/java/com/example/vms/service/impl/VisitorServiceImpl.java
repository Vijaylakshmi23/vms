package com.example.vms.service.impl;

import com.example.vms.entity.Visitor;
import com.example.vms.repository.VisitorRepository;
import com.example.vms.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitorServiceImpl implements VisitorService {

    private final VisitorRepository visitorRepository;

    @Override
    public Visitor addVisitor(Visitor visitor) {
        return visitorRepository.save(visitor);
    }

    @Override
    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    @Override
    public Visitor getVisitorById(Long id) {
        return visitorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));
    }
}
