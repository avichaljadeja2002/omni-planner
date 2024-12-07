package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.calendar.CalendarEvents;
import com.main.omniplanner.calendar.CalendarEventsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

public class CalendarEventsServiceTest {

    private CalendarEventsService calendarEventsService;
    private CalendarEvents calendarEvents;

    @BeforeEach
    void setUp() {
        calendarEventsService = new CalendarEventsService();
    }

    @Test
    public void testGetSaveEvent() {
        calendarEvents.setId(0);
        calendarEvents.setUser_id(0);
        calendarEvents.setTitle("Team Meeting");
        Date date = Date.valueOf("2024-11-05");
        calendarEvents.setEvent_date(date);
        Time time = Time.valueOf("10:30:00");
        calendarEvents.setEvent_time(time);
        calendarEvents.setRepeating(true);
        calendarEvents.setRepeat_timeline("weekly");
        calendarEvents.setDescription("Meeting");
        calendarEventsService.saveEvent(calendarEvents);
        List<CalendarEvents> calendarEventsList = calendarEventsService.getEventsByUserId(0);
        CalendarEvents testCalendarEvents = calendarEventsList.get(0);
        assertEquals(0, testCalendarEvents.getId());
        assertEquals(0, testCalendarEvents.getUser_id());
        assertEquals("Team Meeting", testCalendarEvents.getTitle());
        assertEquals(date, testCalendarEvents.getEvent_date());
        assertEquals(time, testCalendarEvents.getEvent_time());
        assertEquals(true, testCalendarEvents.getRepeating());
        assertEquals("weekly", testCalendarEvents.getRepeat_timeline());
        assertEquals("Meeting", testCalendarEvents.getDescription());
    }
}
