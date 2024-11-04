package com.main.omniplanner.health;

import com.main.omniplanner.calendar.CalendarEventsRepository;
import com.main.omniplanner.finance.FinanceEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthEventsRepository extends JpaRepository<HealthEvents, Integer> {
    List<HealthEvents> findByUserId(int userId);
    @Query("SELECT f FROM HealthEvents f WHERE f.userId = :userId AND (f.repeating = true OR f.event_date >= :currentTimeMillis)")
    List<HealthEvents> findUpcomingByUserId(@Param("userId") int userId, @Param("currentTimeMillis") Long currentTimeMillis);
}
