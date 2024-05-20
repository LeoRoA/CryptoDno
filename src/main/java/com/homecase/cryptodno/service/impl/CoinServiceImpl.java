package com.homecase.cryptodno.service.impl;

import com.homecase.cryptodno.dto.CoinDto;
import com.homecase.cryptodno.dto.CoinsOperationDto;
import com.homecase.cryptodno.entity.CoinsOperation;
import com.homecase.cryptodno.repository.CoinRepository;
import com.homecase.cryptodno.dto.ResponseWrapperCoinsDto;
import com.homecase.cryptodno.entity.Coin;
import com.homecase.cryptodno.repository.CoinsOperationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.homecase.cryptodno.service.CoinService;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.Math.abs;

@Service
@RequiredArgsConstructor
public class CoinServiceImpl implements CoinService {
    private final CoinRepository coinRepository;
    private final CoinsOperationRepository coinsOperationRepository;

    @Override
    public ResponseWrapperCoinsDto getAllCoinsDto() {
        Collection<CoinDto> coinsAll = coinRepository.findAll()
                .stream()
                .map(this::convertToCoinDto)
                .filter(coinDto -> coinDto.getAmount()!=0)
                .collect(Collectors.toList());
        return new ResponseWrapperCoinsDto(coinsAll);
    }

    private CoinDto convertToCoinDto(Coin coin){
        int coinId = coinRepository.findByName(coin.getName()).get().getId();
        List<CoinsOperation> operations = coinsOperationRepository.findAllByCoinId(coinId);

        CoinDto coinDto = new CoinDto();
        double amount = 0.0;
        double price = 0.0;
        double deposit = 0.0;
        double sumDepAmount = 0.0;
//        double sumWdAmount = 0.0;
        double withdrawal = 0.0;
        for (CoinsOperation operation: operations) {
             amount = operation.getAmount();
             price = operation.getPrice();

            if (amount>0) {
                deposit += amount * price;
                sumDepAmount += amount;
            } else{
                withdrawal+=abs(amount*price);
//                sumWdAmount += abs(amount);
            }
        }
        coinDto.setName(coin.getName());
        coinDto.setAmount(operations.stream().mapToDouble(CoinsOperation::getAmount).sum());
        coinDto.setDeposit(deposit);
        coinDto.setAveragePrice(deposit/sumDepAmount);
        coinDto.setWithdrawal(withdrawal);

        return coinDto;
    }
@Override
    public void updateCurrentPriceAndCalculation(CoinDto coinDto, double currentPrice){


        coinDto.setCurrentPrice(currentPrice);
        coinDto.setCurrentBalance(currentPrice*coinDto.getAmount());
        coinDto.setLossProfit(currentPrice*coinDto.getAmount()-(coinDto.getDeposit()- coinDto.getWithdrawal()));
//        return coinDto;
    }

    //    private CoinsOperationDto convertToCoinsOperationDto(Coin coin) {
//
//        CoinsOperationDto coinsOperationDto = new CoinsOperationDto();
//        int coinId = coinRepository.findByName(coin.getName()).get().getId();
//        List<CoinsOperation> operations = coinsOperationRepository.findAllByCoinId(coinId);
//        coinsOperationDto.setName(coin.getName());
//        coinsOperationDto.setAmount(operations.stream().mapToDouble(CoinsOperation::getAmount).sum());
//        coinsOperationDto.setCurrentPrice(CURRENTPRICE);
//        return coinsOperationDto;
//    }
    private CoinsOperationDto addNewOperation(CoinsOperationDto coinsOperationDto, boolean buy){
        CoinsOperation newCoinsOperation = new CoinsOperation();
        newCoinsOperation.setCoinId(coinRepository.findByName(coinsOperationDto.getName()).get().getId());
        newCoinsOperation.setPrice(coinsOperationDto.getOperationPrice());
        newCoinsOperation.setOpDate(coinsOperationDto.getOpTime());
        newCoinsOperation.setAmount(buy? coinsOperationDto.getAmount():(-coinsOperationDto.getAmount()));
        coinsOperationRepository.save(newCoinsOperation);
        return coinsOperationDto;
    }

    @Override
    public CoinsOperationDto buyCoin(CoinsOperationDto coinsOperationDto) {
        coinRepository.findByName(coinsOperationDto.getName()).orElseGet(() -> {
            Coin newCoin = new Coin();
            newCoin.setName(coinsOperationDto.getName());
            return coinRepository.save(newCoin);
        });

        return addNewOperation(coinsOperationDto,true);
    }

    @Override
    public CoinsOperationDto sellCoin(CoinsOperationDto coinsOperationDto) {
        return addNewOperation(coinsOperationDto,false);

    }
    @Override
    public List<CoinsOperationDto> getHistoryByName(String coinName){
        return coinsOperationRepository.findAllByCoinId(coinRepository.findByName(coinName).get().getId())
                .stream()
                .map(coinOperation -> {
                    CoinsOperationDto dto = new CoinsOperationDto();
                    dto.setId(coinOperation.getId());
                    dto.setName(coinName);
                    dto.setAmount(coinOperation.getAmount());
                    dto.setOpTime(coinOperation.getOpDate());
                    dto.setOperationPrice(coinOperation.getPrice());
                    return dto;
                })
                .collect(Collectors.toList());

    }
    @Override
    public List<String> getAllNames() {
        return coinRepository.findAll().stream().map(Coin::getName).collect(Collectors.toList());
    }

    @Override
    public double getPrice(String coinName) {
        return coinRepository.findByName(coinName).get().getCurrentPrice();
    }

    @Override
    public void setPrice(String coinName, double currentPrice) {
        Optional<Coin> optionalCoin = coinRepository.findByName(coinName);
        if (optionalCoin.isPresent()) {
            Coin coin = optionalCoin.get();
            coin.setCurrentPrice(currentPrice);
            coinRepository.save(coin);
        } else {
            Coin newCoin = new Coin();
            newCoin.setName(coinName);
            newCoin.setCurrentPrice(currentPrice);
        }
    }

    @Override
    public List<String> getAvailableNames(){
         Set<Integer> listId = coinsOperationRepository.findAll()
                 .stream()
                 .map(CoinsOperation::getCoinId)
                 .collect(Collectors.toSet());
         return coinRepository.findAll()
                 .stream()
                 .filter(coin -> listId.contains(coin.getId()))
                 .map(Coin::getName)
                 .collect(Collectors.toList());
    }
}
