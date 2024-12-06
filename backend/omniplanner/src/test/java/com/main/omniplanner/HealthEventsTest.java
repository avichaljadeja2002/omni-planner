package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.health.HealthEvents;
import com.main.omniplanner.health.HealthEventsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

public class HealthEventsTest {

    private HealthEvents healthEvents;

    @BeforeEach
    void setUp() {
        healthEvents = new HealthEvents();
    }

    @Test
    public void testGetSetId() {
        healthEvents.setId(0);
        assertEquals(0, healthEvents.getId());
    }

    @Test
    public void testGetSetUser_id() {
        healthEvents.setUser_id(0);
        assertEquals(0, healthEvents.getUser_id());
    }

    @Test
    public void testGetSetTitle() {
        healthEvents.setTitle("Team Meeting");
        assertEquals("Team Meeting", healthEvents.getTitle());
    }

    @Test
    public void testGetSetEvent_date() {
        Date date = Date.valueOf("2024-11-05");
        healthEvents.setEvent_date(date);
        assertEquals(date, healthEvents.getEvent_date());
    }

    @Test
    public void testGetSetEvent_time() {
        Time time = Time.valueOf("10:30:00");
        healthEvents.setEvent_time(time);
        assertEquals(time, healthEvents.getEvent_time());
    }

    @Test
    public void testGetSetRepeating() {
        healthEvents.setRepeating(true);
        assertEquals(true, healthEvents.getRepeating());
    }

    @Test
    public void testGetSetRepeat_timeline() {
        healthEvents.setRepeat_timeline("weekly");
        assertEquals("weekly", healthEvents.getRepeat_timeline());
    }
}