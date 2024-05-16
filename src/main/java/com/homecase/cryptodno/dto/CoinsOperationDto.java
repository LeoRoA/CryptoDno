package com.homecase.cryptodno.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CoinsOperationDto {
    private Long id;

    private String name;

    private double amount;

    private LocalDateTime opTime;

    private double operationPrice;
}
