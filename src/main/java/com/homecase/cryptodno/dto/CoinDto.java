package com.homecase.cryptodno.dto;

import lombok.Data;

@Data
public class CoinDto {
    private String name;
    private double amount;
    private double deposit;
    private double withdrawal;
    private double currentPrice;
    private double currentBalance;
    private double lossProfit;
}
