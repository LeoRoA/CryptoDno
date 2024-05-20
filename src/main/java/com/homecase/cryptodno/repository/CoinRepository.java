package com.homecase.cryptodno.repository;

import com.homecase.cryptodno.entity.Coin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoinRepository extends JpaRepository<Coin, Integer> {
    Optional<Coin> findByName(String name);
//    void setCurrentPrice(String name, double currentPrice);

}
