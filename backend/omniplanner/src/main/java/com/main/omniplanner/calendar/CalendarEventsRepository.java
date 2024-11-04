package com.main.omniplanner.calendar;

import com.main.omniplanner.finance.FinanceEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventsRepository extends JpaRepository<CalendarEvents, Integer> {
    List<CalendarEvents> findByUserId(int userId);
    @Query("SELECT f FROM CalendarEvents f WHERE f.userId = :userId AND (f.repeating = true OR f.event_date >= CURRENT_DATE)")
    List<CalendarEvents> findUpcomingByUserId(@Param("userId") int userId);
}
