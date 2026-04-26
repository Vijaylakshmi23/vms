package com.example.vms.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "visitors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String phone;

    private String photoUrl;

    private boolean blacklisted;

    // FIX: @JsonIgnore prevents infinite circular serialization
    // Visitor -> visitRequests -> visitor -> visitRequests -> ...
    @JsonIgnore
    @OneToMany(mappedBy = "visitor", cascade = CascadeType.ALL)
    private List<VisitRequest> visitRequests;
}