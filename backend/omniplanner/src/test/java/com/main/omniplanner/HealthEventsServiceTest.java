package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.health.HealthEvents;
import com.main.omniplanner.health.HealthEventsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class HealthEventsServiceTest {

    private HealthEventsService healthEventsService;
    private HealthEvents healthEvents;

    @BeforeEach
    void setUp() {
        healthEventsService = new HealthEventsService();
    }

    @Test
    public void testGetSaveEvent() {
        healthEvents.setId(0);
        healthEvents.setUser_id(0);
        healthEvents.setTitle("Team Meeting");
        Date date = Date.valueOf("2024-11-05");
        healthEvents.setEvent_date(date);
        Time time = Time.valueOf("10:30:00");
        healthEvents.setEvent_time(time);
        healthEvents.setRepeating(true);
        healthEvents.setRepeat_timeline("weekly");
        healthEventsService.saveEvent(healthEvents);
        List<HealthEvents> healthEventsList = healthEventsService.getEventsByUserId(0);
        HealthEvents testHealthEvents = healthEventsList.get(0);
        assertEquals(0, testHealthEvents.getId());
        assertEquals(0, testHealthEvents.getUser_id());
        assertEquals("Team Meeting", testHealthEvents.getTitle());
        assertEquals(date, testHealthEvents.getEvent_date());
        assertEquals(time, testHealthEvents.getEvent_time());
        assertEquals(true, testHealthEvents.isRepeating());
        assertEquals("weekly", testHealthEvents.getRepeat_timeline());
    }
}
