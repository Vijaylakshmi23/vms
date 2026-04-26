package com.example.vms.service;

import java.util.List;

import com.example.vms.entity.Visitor;

public interface VisitorService {

    Visitor addVisitor(Visitor visitor);

    List<Visitor> getAllVisitors();

    Visitor getVisitorById(Long id);
}
