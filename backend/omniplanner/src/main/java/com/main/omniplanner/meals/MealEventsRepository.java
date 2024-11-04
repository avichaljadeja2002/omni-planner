package com.main.omniplanner.meals;

import com.main.omniplanner.finance.FinanceEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealEventsRepository extends JpaRepository<MealEvents, Integer> {
    List<MealEvents> findByUserId(int userId);
    @Query("SELECT f FROM MealEvents f WHERE f.userId = :userId AND f.event_date >= CURRENT_DATE")
    List<MealEvents> findUpcomingByUserId(@Param("userId") int userId);
}
