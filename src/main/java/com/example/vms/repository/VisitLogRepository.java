package com.example.vms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vms.entity.VisitLog;

public interface VisitLogRepository extends JpaRepository<VisitLog, Long> {
}
