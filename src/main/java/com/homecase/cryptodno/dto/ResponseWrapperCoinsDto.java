package com.homecase.cryptodno.dto;

import lombok.Data;

import java.util.Collection;

@Data
public class ResponseWrapperCoinsDto {
    private int count;
    private Collection<CoinDto> results;

    public ResponseWrapperCoinsDto (Collection<CoinDto> results){
        this.count = results.size();
        this.results = results;
    }
}
