package com.homecase.cryptodno.service;

import com.homecase.cryptodno.dto.CoinDto;
import com.homecase.cryptodno.dto.CoinsOperationDto;
import com.homecase.cryptodno.dto.ResponseWrapperCoinsDto;

import java.util.List;
//import dto.*;

public interface CoinService {
    ResponseWrapperCoinsDto getAllCoinsDto();
    void updateCurrentPriceAndCalculation(CoinDto coinDto, double currentPrice);

    CoinsOperationDto buyCoin(CoinsOperationDto coinsOperationDto);


    CoinsOperationDto sellCoin(CoinsOperationDto coinsOperationDto);

    List<CoinsOperationDto> getHistoryByName(String coinName);
    List<String> getAllNames();

    List<String> getAvailableNames();

    double getPrice(String coinName);
    void setPrice(String coinName, double currentPrice);
}
