package com.example.vms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "visit_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String purpose;

    private LocalDateTime visitDate;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    @Enumerated(EnumType.STRING)
    private VisitStatus status;

    @Column(columnDefinition = "TEXT")
    private String qrCode;

    @ManyToOne
    @JoinColumn(name = "visitor_id")
    private Visitor visitor;

    @ManyToOne
    @JoinColumn(name = "host_id")
    private User host;

    @JsonIgnore
    @OneToMany(mappedBy = "visitRequest", cascade = CascadeType.ALL)
    private List<VisitLog> visitLogs;
}
