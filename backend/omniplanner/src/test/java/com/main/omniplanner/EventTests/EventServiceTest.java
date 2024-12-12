package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventService;
import com.main.omniplanner.user.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class EventServiceTest {

    private EventService eventService;
    private Event event;

    @Mock
    private EventRepository eventRepository;

    private Date date;
    private Time time;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        eventService = new EventService(eventRepository);
        event = new Event();
        event.setId(0);
        date = Date.valueOf("2024-11-05");
        event.setEventDate(date);
        time = Time.valueOf("10:30:00");
        event.setEventTime(time);
        event.setMoney(9.99f);
        event.setRepeatTimeline("weekly");
        event.setRepeating(true);
        event.setTitle("Team Meeting");
        event.setEvent_type("Work");
        event.setUserId(0);
    }

    @Test
    public void testGetSaveEvent() {
        when(eventRepository.save(event)).thenReturn(event);
        when(eventRepository.findUpcomingByUserId(eq(0), anyLong()))
                .thenReturn(Collections.singletonList(event));

        eventService.saveEvent(event);
        List<Event> eventList = eventService.getEventsByUserId(0);
        assertFalse(eventList.isEmpty(), "The list should not be empty");
        Event testEvent = eventList.get(0);
        assertEquals(0, testEvent.getId());
        assertEquals(date, testEvent.getEventDate());
        assertEquals(time, testEvent.getEventTime());
        assertEquals(9.99, testEvent.getMoney(), 0.0001, "Money value mismatch");
        assertEquals("weekly", testEvent.getRepeatTimeline());
        assertEquals(true, testEvent.getRepeating());
        assertEquals("Team Meeting", testEvent.getTitle());
        assertEquals("Work", testEvent.getEvent_type());
        assertEquals(0, testEvent.getUserId());

        verify(eventRepository).save(event);
        verify(eventRepository).findUpcomingByUserId(eq(0), anyLong());
    }
}
