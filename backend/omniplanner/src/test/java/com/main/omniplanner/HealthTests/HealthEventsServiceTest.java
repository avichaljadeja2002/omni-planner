package com.main.omniplanner.HealthTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.health.HealthEvents;
import com.main.omniplanner.health.HealthEventsService;
import com.main.omniplanner.health.HealthEventsRepository;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class HealthEventsServiceTest {

    private HealthEventsService healthEventsService;
    private HealthEvents healthEvents;

    @Mock
    private HealthEventsRepository healthEventsRepository;

    @Mock
    private EventService eventService;

    private Date date;
    private Time time;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        healthEventsService = new HealthEventsService(healthEventsRepository, eventService);
        healthEvents = new HealthEvents();
        healthEvents.setId(0);
        healthEvents.setUser_id(0);
        healthEvents.setTitle("Team Meeting");
        date = Date.valueOf("2024-11-05");
        healthEvents.setEvent_date(date);
        time = Time.valueOf("10:30:00");
        healthEvents.setEvent_time(time);
        healthEvents.setRepeating(true);
        healthEvents.setRepeat_timeline("weekly");
    }

    @Test
    public void testGetSaveEvent() {
        when(healthEventsRepository.save(healthEvents)).thenReturn(healthEvents);
        when(healthEventsRepository.findUpcomingByUserId(eq(0), anyLong()))
                .thenReturn(Collections.singletonList(healthEvents));

        healthEventsService.saveEvent(healthEvents);
        List<HealthEvents> healthEventsList = healthEventsService.getEventsByUserId(0);
        assertFalse(healthEventsList.isEmpty(), "The list should not be empty");
        HealthEvents testHealthEvents = healthEventsList.get(0);
        assertEquals(0, testHealthEvents.getId());
        assertEquals(0, testHealthEvents.getUser_id());
        assertEquals("Team Meeting", testHealthEvents.getTitle());
        assertEquals(date, testHealthEvents.getEvent_date());
        assertEquals(time, testHealthEvents.getEvent_time());
        assertTrue(testHealthEvents.isRepeating());
        assertEquals("weekly", testHealthEvents.getRepeat_timeline());

        verify(healthEventsRepository).save(healthEvents);
        verify(healthEventsRepository).findUpcomingByUserId(eq(0), anyLong());
    }
}
