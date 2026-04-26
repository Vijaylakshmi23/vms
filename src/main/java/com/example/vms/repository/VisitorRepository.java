package com.example.vms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vms.entity.Visitor;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
}
