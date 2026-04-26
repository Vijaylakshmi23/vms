package com.example.vms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @Enumerated(EnumType.STRING)
    private VisitLogStatus status;

    // 🔗 Many logs belong to ONE visit request
    @ManyToOne
    @JoinColumn(name = "visit_request_id")
    private VisitRequest visitRequest;
}
