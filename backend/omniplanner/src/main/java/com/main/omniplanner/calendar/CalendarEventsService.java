package com.main.omniplanner.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarEventsService {

    @Autowired
    private CalendarEventsRepository calendarEventsRepository;

    public CalendarEvents saveEvent(CalendarEvents event) {
        return calendarEventsRepository.save(event);
    }

    public List<CalendarEvents> getEventsByUserId(int userId) {
        return calendarEventsRepository.findByUserId(userId);
    }

}
