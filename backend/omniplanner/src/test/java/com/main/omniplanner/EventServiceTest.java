package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class EventServiceTest {

    private EventService eventService;
    private Event event;

    @BeforeEach
    void setUp() {
        eventService = new EventService();
    }

    @Test
    public void testGetSaveEvent() {
        event.setId(0);
        Date date = Date.valueOf("2024-11-05");
        event.setEventDate(date);
        Time time = Time.valueOf("10:30:00");
        event.setEventTime(time);
        event.setMoney(9.99f);
        event.setRepeatTimeline("weekly");
        event.setRepeating(true);
        event.setTitle("Team Meeting");
        event.setEvent_type("Work");
        event.setUserId(0);

        eventService.saveEvent(event);
        List<Event> eventList = eventService.getEventsByUserId(0);
        Event testEvent = eventList.get(0);
        assertEquals(0, testEvent.getId());
        assertEquals(date, testEvent.getEventDate());
        assertEquals(time, testEvent.getEventTime());
        assertEquals(9.99, testEvent.getMoney());
        assertEquals("weekly", testEvent.getRepeatTimeline());
        assertEquals(true, testEvent.getRepeating());
        assertEquals("Team Meeting", testEvent.getTitle());
        assertEquals("Work", testEvent.getEvent_type());
        assertEquals(0, testEvent.getUserId());
    }
}
