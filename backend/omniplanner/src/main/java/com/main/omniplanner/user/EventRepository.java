package com.main.omniplanner.user;

import com.main.omniplanner.finance.FinanceEvents;
import com.main.omniplanner.health.HealthEvents;
import com.main.omniplanner.meals.MealEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByUserId(int userId);

    @Query("SELECT f FROM Event f WHERE f.userId = :userId AND (f.repeating = true OR f.eventDate >= :currentTimeMillis)")
    List<Event> findUpcomingByUserId(@Param("userId") int userId, @Param("currentTimeMillis") Long currentTimeMillis);
}
