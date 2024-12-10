package com.main.omniplanner.calendar;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarEventsService {

    @Autowired
    private CalendarEventsRepository calendarEventsRepository;
    @Autowired
    private EventService eventService;

    // Constructor injection
    public CalendarEventsService(CalendarEventsRepository calendarEventsRepository, EventService eventService) {
        this.calendarEventsRepository = calendarEventsRepository;
        this.eventService = eventService;
    }

    public CalendarEvents saveEvent(CalendarEvents event) {
        Event event1 = new Event();
        event1.setEventDate(event.getEvent_date());
        event1.setEventTime(event.getEvent_time());
        event1.setTitle(event.getTitle());
        event1.setUserId(event.getUser_id());
        event1.setDescription(event.getDescription());
        event1.setEvent_type("calendar");
        event1.setRepeating(event.isRepeating());
        event1.setRepeatTimeline(event.getRepeat_timeline());
        eventService.saveEvent(event1);
        return calendarEventsRepository.save(event);
    }

    public List<CalendarEvents> getEventsByUserId(int userId) {
        Long currentTimeMillis = System.currentTimeMillis();
        return calendarEventsRepository.findUpcomingByUserId(userId, currentTimeMillis);
    }

}
