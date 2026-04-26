package com.example.vms.service;

import java.util.List;

import com.example.vms.entity.VisitLog;

public interface VisitLogService {

    VisitLog checkIn(Long visitRequestId);

    VisitLog checkOut(Long visitLogId);

    List<VisitLog> getAllLogs();

    VisitLog getLogById(Long id);
}
