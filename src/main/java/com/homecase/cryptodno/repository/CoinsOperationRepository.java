package com.homecase.cryptodno.repository;

import com.homecase.cryptodno.entity.CoinsOperation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoinsOperationRepository extends JpaRepository<CoinsOperation,Long> {
    List<CoinsOperation> findAllByCoinId(int coinId);

}
