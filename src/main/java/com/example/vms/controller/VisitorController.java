package com.example.vms.controller;

import com.example.vms.entity.Visitor;
import com.example.vms.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorService visitorService;

    @PostMapping
    public Visitor addVisitor(@RequestBody Visitor visitor) {
        return visitorService.addVisitor(visitor);
    }

    @GetMapping
    public List<Visitor> getAllVisitors() {
        return visitorService.getAllVisitors();
    }

    @GetMapping("/{id}")
    public Visitor getVisitorById(@PathVariable Long id) {
        return visitorService.getVisitorById(id);
    }
}
