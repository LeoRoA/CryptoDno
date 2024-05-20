package com.homecase.cryptodno.controller;


import com.google.gson.JsonObject;
import org.springframework.web.bind.annotation.RestController;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.http.GET;
import retrofit2.http.Query;

@RestController
public interface CoinGeckoApiController {
//    @GET("simple/price?ids={coinName}&vs_currencies=usd")
//    Call<JsonObject> getCoinPrice(@Path("coinName") String coinName);

    @GET("simple/price")
    Call<JsonObject> getCoinPrice(@Query("ids") String coinName, @Query("vs_currencies") String currency);



}
