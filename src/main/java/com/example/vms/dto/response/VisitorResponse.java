package com.example.vms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VisitorResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
}
