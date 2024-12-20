package com.main.omniplanner.calendar;

import com.main.omniplanner.finance.FinanceEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Repository
public interface CalendarEventsRepository extends JpaRepository<CalendarEvents, Integer> {
    List<CalendarEvents> findByUserId(int userId);
    @Query("SELECT f FROM CalendarEvents f WHERE f.userId = :userId AND (f.repeating = true OR f.event_date >= :currentTimeMillis) ORDER BY f.event_date ASC")
    List<CalendarEvents> findUpcomingByUserId(@Param("userId") int userId, @Param("currentTimeMillis") Long currentTimeMillis);

    @Modifying
    @Query("UPDATE CalendarEvents f SET f.title = :title, f.event_date = :event_date, f.event_time = :event_time, f.repeating = :repeating, f.repeat_timeline = :repeat_timeline, f.description = :description WHERE f.id = :id" )
    void updateEvent(@Param("id") int id, @Param("title") String title, @Param("event_date") Date event_date, @Param("event_time") Time event_time, @Param("repeating") boolean repeating, @Param("repeat_timeline") String repeat_timeline, @Param("description") String description);
}
