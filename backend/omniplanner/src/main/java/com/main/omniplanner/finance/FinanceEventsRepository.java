package com.main.omniplanner.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinanceEventsRepository extends JpaRepository<FinanceEvents, Integer> {
    List<FinanceEvents> findByUserId(int userId);
}
