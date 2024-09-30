package com.main.omniplanner.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventsRepository extends JpaRepository<CalendarEvents, Integer> {
    List<CalendarEvents> findByUserId(int userId);
}
