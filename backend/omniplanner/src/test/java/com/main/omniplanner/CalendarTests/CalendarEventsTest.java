package com.main.omniplanner.CalendarTests;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.calendar.CalendarEvents;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

public class CalendarEventsTest {

    private CalendarEvents calendarEvents;

    @BeforeEach
    void setUp() {
        calendarEvents = new CalendarEvents();
    }

    @Test
    public void testGetSetId() {
        calendarEvents.setId(0);
        assertEquals(0, calendarEvents.getId());
    }

    @Test
    public void testGetsetUserId() {
        calendarEvents.setUserId(0);
        assertEquals(0, calendarEvents.getUserId());
    }

    @Test
    public void testGetSetTitle() {
        calendarEvents.setTitle("Team Meeting");
        assertEquals("Team Meeting", calendarEvents.getTitle());
    }

    @Test
    public void testGetSetEvent_date() {
        Date date = Date.valueOf("2024-11-05");
        calendarEvents.setEvent_date(date);
        assertEquals(date, calendarEvents.getEvent_date());
    }

    @Test
    public void testGetSetEvent_time() {
        Time time = Time.valueOf("10:30:00");
        calendarEvents.setEvent_time(time);
        assertEquals(time, calendarEvents.getEvent_time());
    }

    @Test
    public void testGetSetRepeating() {
        calendarEvents.setRepeating(true);
        assertEquals(true, calendarEvents.isRepeating());
    }

    @Test
    public void testGetSetRepeat_timeline() {
        calendarEvents.setRepeat_timeline("weekly");
        assertEquals("weekly", calendarEvents.getRepeat_timeline());
    }

    @Test
    public void testGetSetDescription() {
        calendarEvents.setDescription("Meeting");
        assertEquals("Meeting", calendarEvents.getDescription());
    }
}
