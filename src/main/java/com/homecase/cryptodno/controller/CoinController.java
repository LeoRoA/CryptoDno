package com.homecase.cryptodno.controller;

import com.google.gson.JsonObject;
import com.homecase.cryptodno.dto.CoinDto;
import com.homecase.cryptodno.dto.CoinsOperationDto;
import com.homecase.cryptodno.dto.ResponseWrapperCoinsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.homecase.cryptodno.service.CoinService;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import org.springframework.core.io.ResourceLoader;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/coins")
@RequiredArgsConstructor
public class CoinController {
    private final CoinService coinService;
    private final ResourceLoader resourceLoader;
    private final Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://api.coingecko.com/api/v3/")
            .addConverterFactory(GsonConverterFactory.create())
            .build();

    @GetMapping("/allNames")
    public ResponseEntity<List<String>> getAllNames() {
        List<String> names = coinService.getAllNames();
        return ResponseEntity.ok(names);
    }
    @GetMapping("/availableNames")
    public ResponseEntity<List<String>> getAvailableNames() {
        List<String> names = coinService.getAvailableNames();
        return ResponseEntity.ok(names);
    }
    @GetMapping("/history/{coinName}")
    public ResponseEntity<List<CoinsOperationDto>> getHistoryByName(@PathVariable String coinName) {
        List<CoinsOperationDto> names = coinService.getHistoryByName(coinName);
        return ResponseEntity.ok(names);
    }

    @GetMapping()
    public ResponseEntity<ResponseWrapperCoinsDto> getAllCoins() {
        ResponseWrapperCoinsDto responseWrapperCoinsDto = coinService.getAllCoinsDto();
        Collection<CoinDto> results = responseWrapperCoinsDto.getResults();
        CoinGeckoApiController coinGeckoApiController = retrofit.create(CoinGeckoApiController.class);
        for (CoinDto coinDto : results) {
            coinService.updateCurrentPriceAndCalculation(coinDto,updateCoinPrice(coinDto, coinGeckoApiController));
        }
        return ResponseEntity.ok(responseWrapperCoinsDto);
    }

    private double updateCoinPrice(CoinDto coinDto, CoinGeckoApiController coinGeckoApiController) {
        String coinName = coinDto.getName();
        double usdPrice = 0.0;
        Call<JsonObject> call = coinGeckoApiController.getCoinPrice(coinName,"usd");
        try {
            Response<JsonObject> response = call.execute();
            if (response.isSuccessful()) {
                JsonObject coinPriceJson = response.body();

//                    if (coinPriceJson!= null && coinPriceJson.has("usd")) {
                    usdPrice = coinPriceJson.getAsJsonObject(coinName).get("usd").getAsDouble();
                System.out.println(coinName);
                coinService.setPrice(coinName,usdPrice);
//                    coinDto.setCurrentPrice(usdPrice);
//                }
            } else {
                System.out.println("Failed to update price for " + coinName + ". Error: " + response.errorBody().string());
//                JsonObject cachedData = dataCache.getData(coinName);
                // Возвращаем данные из кэша
//                usdPrice = cachedData.getAsJsonObject(coinName).get("usd").getAsDouble();
                usdPrice = coinService.getPrice(coinName);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return usdPrice;
    }


    @PostMapping("/sell")
    public ResponseEntity<CoinsOperationDto> sellCoin(@RequestBody CoinsOperationDto coinsOperationDto) {
        CoinsOperationDto response = coinService.sellCoin(coinsOperationDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    //
    @PostMapping("/buy")
    public ResponseEntity<CoinsOperationDto> buyCoin(@RequestBody CoinsOperationDto coinsOperationDto) {
        CoinsOperationDto response = coinService.buyCoin(coinsOperationDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}




//@GetMapping()
//    public ResponseEntity<ResponseWrapperCoinsDto> getAllCoins(){
//        ResponseWrapperCoinsDto responseWrapperCoinsDto = coinService.getAllCoinsDto();
//
//        Collection<CoinDto> results = responseWrapperCoinsDto.getResults();
//
//        // Проходим по всем монетам в списке
//        for (CoinDto coinDto : results) {
//            // Вызываем метод для обновления стоимости каждой монеты
//            updateCoinPrice(coinDto);
//        }
//        return ResponseEntity.ok(coinService.getAllCoinsDto());
//    }
//    private void updateCoinPrice(CoinDto coinDto) {
//        // Получаем название монеты
//        String coinName = coinDto.getName();
//
//        // Выполняем запрос к CoinGecko API для получения цены монеты
//        Call<JsonObject> call = coinGeckoApiController.getCoinPrice(coinName);
//
//        try {
//            Response<JsonObject> response = call.execute();
//            if (response.isSuccessful()) {
//                JsonObject coinPriceJson = response.body();
//                double usdPrice = coinPriceJson.get("usd").getAsDouble();
//
//                // Обновляем цену монеты
//                coinDto.setCurrentPrice(usdPrice);
//            } else {
//                System.out.println("Failed to update price for " + coinName + ". Error: " + response.errorBody().string());
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }