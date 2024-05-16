package com.homecase.cryptodno.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "coins_operation")
public class CoinsOperation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coinId",nullable = false)
    private int coinId;

    @Column(name ="amount",nullable = false)
    private double amount;

    @Column(name = "operation_date", nullable = false)
    private LocalDateTime opDate;

    @Column(name = "operation_price")
    private double price;
}
