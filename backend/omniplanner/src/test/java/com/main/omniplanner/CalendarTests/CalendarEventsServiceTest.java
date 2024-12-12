package com.main.omniplanner.CalendarTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.calendar.CalendarEvents;
import com.main.omniplanner.calendar.CalendarEventsService;
import com.main.omniplanner.calendar.CalendarEventsRepository;
import com.main.omniplanner.user.EventService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class CalendarEventsServiceTest {

    private CalendarEventsService calendarEventsService;
    private CalendarEvents calendarEvents;

    @Mock
    private CalendarEventsRepository calendarEventsRepository;
    @Mock
    private EventService eventService;

    private Date date;
    private Time time;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        calendarEventsService = new CalendarEventsService(calendarEventsRepository, eventService);
        calendarEvents = new CalendarEvents();
        calendarEvents.setId(0);
        calendarEvents.setUser_id(0);
        calendarEvents.setTitle("Team Meeting");
        date = Date.valueOf("2024-11-05");
        calendarEvents.setEvent_date(date);
        time = Time.valueOf("10:30:00");
        calendarEvents.setEvent_time(time);
        calendarEvents.setRepeating(true);
        calendarEvents.setRepeat_timeline("weekly");
        calendarEvents.setDescription("Meeting");
    }

    @Test
    public void testGetSaveEvent() {
        when(calendarEventsRepository.save(calendarEvents)).thenReturn(calendarEvents);
        when(calendarEventsRepository.findUpcomingByUserId(eq(0), anyLong()))
                .thenReturn(Collections.singletonList(calendarEvents));
        calendarEventsService.saveEvent(calendarEvents);
        List<CalendarEvents> calendarEventsList = calendarEventsService.getEventsByUserId(0);
        assertFalse(calendarEventsList.isEmpty(), "The list should not be empty");
        CalendarEvents testCalendarEvents = calendarEventsList.get(0);
        assertEquals(0, testCalendarEvents.getId());
        assertEquals(0, testCalendarEvents.getUser_id());
        assertEquals("Team Meeting", testCalendarEvents.getTitle());
        assertEquals(date, testCalendarEvents.getEvent_date());
        assertEquals(time, testCalendarEvents.getEvent_time());
        assertEquals(true, testCalendarEvents.isRepeating());
        assertEquals("weekly", testCalendarEvents.getRepeat_timeline());
        assertEquals("Meeting", testCalendarEvents.getDescription());

        verify(calendarEventsRepository).save(calendarEvents);
        verify(calendarEventsRepository).findUpcomingByUserId(eq(0), anyLong());
    }
}