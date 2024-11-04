package com.main.omniplanner.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinanceEventsRepository extends JpaRepository<FinanceEvents, Integer> {
    List<FinanceEvents> findByUserId(int userId);
    @Query("SELECT f FROM FinanceEvents f WHERE f.userId = :userId AND (f.repeating = true OR f.event_date >= CURRENT_DATE)")
    List<FinanceEvents> findUpcomingByUserId(@Param("userId") int userId);
}