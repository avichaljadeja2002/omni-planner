package com.main.omniplanner.EventTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.user.GenericEvent;
import com.main.omniplanner.user.EventService;
import com.main.omniplanner.user.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

public class EventServiceTest {

    private EventService eventService;
    private GenericEvent event;

    @Mock
    private EventRepository eventRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        eventService = new EventService(eventRepository);
        event = new GenericEvent();
        event.setId(0);
        event.setEvent_date("2024-11-05");
        event.setEvent_time("10:30:00");
        event.setMoney(9.99f);
        event.setRepeat_timeline(2);
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

        eventService.saveEvent(event, "Work");
        List<GenericEvent> eventList = eventService.getEventsByUserId(0);
        assertFalse(eventList.isEmpty(), "The list should not be empty");
        GenericEvent testEvent = eventList.get(0);
        assertEquals(0, testEvent.getId());
        assertEquals("2024-11-05", testEvent.getEvent_date());
        assertEquals("10:30:00", testEvent.getEvent_time());
        assertEquals(9.99, testEvent.getMoney(), 0.0001, "Money value mismatch");
        assertEquals(2, testEvent.getRepeat_timeline());
        assertEquals(true, testEvent.getRepeating());
        assertEquals("Team Meeting", testEvent.getTitle());
        assertEquals("Work", testEvent.getEvent_type());
        assertEquals(0, testEvent.getUserId());

        verify(eventRepository).save(event);
        verify(eventRepository).findUpcomingByUserId(eq(0), anyLong());
    }

    @Test void testGetEventsByType() {
        when(eventRepository.findByEventType(eq("Work"), eq(0), anyLong()))
                .thenReturn(Collections.singletonList(event));

        List<GenericEvent> eventList = eventService.getEventsByType("Work", 0);
        assertFalse(eventList.isEmpty(), "The list should not be empty");
        GenericEvent testEvent = eventList.get(0);
        assertEquals(0, testEvent.getId());
        assertEquals("2024-11-05", testEvent.getEvent_date());
        assertEquals("10:30:00", testEvent.getEvent_time());
        assertEquals(9.99, testEvent.getMoney(), 0.0001, "Money value mismatch");
        assertEquals(2, testEvent.getRepeat_timeline());
        assertEquals(true, testEvent.getRepeating());
        assertEquals("Team Meeting", testEvent.getTitle());
        assertEquals("Work", testEvent.getEvent_type());
        assertEquals(0, testEvent.getUserId());

        verify(eventRepository).findByEventType(eq("Work"), eq(0), anyLong());
    }
}
