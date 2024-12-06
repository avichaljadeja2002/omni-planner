package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

public class EventServiceTest {

    private EventService eventService;
    private Event event;

    @BeforeEach
    void setUp() {
        eventService = new eventService();
    }

    @Test
    public void testGetSaveEvent() {
        event.setId(0);
        Date date = Date.valueOf("2024-11-05");
        event.setEvent_date(date);
        Time time = Time.valueOf("10:30:00");
        event.setEvent_time(time);
        event.setMoney(9.99);
        event.setRepeat_timeline("weekly");
        event.setRepeating(true);
        event.setTitle("Team Meeting");
        event.setEvent_type("Work");
        event.setUser_id(0);

        eventService.saveEvent(event);
        List<Event> eventList = eventService.getEventsByUserId(0);
        Event testEvent = eventList.get(0);
        assertEquals(0, testEvent.getId());
        assertEquals(date, testEvent.getEvent_date());
        assertEquals(time, testEvent.getEvent_time());
        assertEquals(9.99, testEvent.getMoney());
        assertEquals("weekly", testEvent.getRepeat_timeline());
        assertEquals(true, testEvent.getRepeating());
        assertEquals("Team Meeting", testEvent.getTitle());
        assertEquals("Work", testEvent.getEvent_type());
        assertEquals(0, testFinanceEvents.getUser_id());
    }
}