package com.main.omniplanner.EventTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.user.GenericEvent;
import com.main.omniplanner.user.EventService;
import com.main.omniplanner.user.EventRepository;
import com.main.omniplanner.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

public class EventServiceTest {

    private EventService eventService;
    private GenericEvent event;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private EventRepository eventRepository;

    private String token;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        token = "1a2b3c4d";
        userRepository = mock(UserRepository.class); // Mock the userRepository
        eventRepository = mock(EventRepository.class);
        eventService = new EventService(eventRepository, userRepository);
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
        // Initialize event with incorrect values
        event.setEvent_type("Personal");
        event.setUserId(999);

        when(userRepository.getIdByToken(token)).thenReturn(0);
        when(eventRepository.save(event)).thenReturn(event);
        when(eventRepository.findUpcomingByUserId(eq(0), anyLong()))
                .thenReturn(List.of(event));

        // Test saveEvent return value
        GenericEvent savedEvent = eventService.saveEvent(event, "Work", token);

        // Verify setters were called via field assertions
        assertEquals("Work", savedEvent.getEvent_type());
        assertEquals(0, savedEvent.getUserId());

        // Existing assertions
        List<GenericEvent> eventList = eventService.getEventsByUserId(0);
        assertFalse(eventList.isEmpty());
        verify(eventRepository).save(event);
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

    @Test
    void testDeleteEvent_Success() {
        when(userRepository.getIdByToken(token)).thenReturn(1);
        when(eventRepository.deleteEvent(1, 1)).thenReturn(1);

        assertTrue(eventService.deleteEvent(1, token));
    }

    @Test
    void testDeleteEvent_Failure() {
        when(userRepository.getIdByToken(token)).thenReturn(1);
        when(eventRepository.deleteEvent(2, 1)).thenReturn(0);

        assertFalse(eventService.deleteEvent(2, token));
    }

    @Test
    void testDeleteEvent_InvalidUser() {
        when(userRepository.getIdByToken(token)).thenReturn(null);

        assertThrows(NullPointerException.class,
                () -> eventService.deleteEvent(1, token));
    }

    @Test
    void testCompleteEvent_Success() {
        when(userRepository.getIdByToken(token)).thenReturn(1);
        when(eventRepository.completeEvent(1)).thenReturn(1);

        assertTrue(eventService.completeEvent(1, token));
    }

    @Test
    void testCompleteEvent_Failure() {
        when(userRepository.getIdByToken(token)).thenReturn(1);
        when(eventRepository.completeEvent(2)).thenReturn(0);

        assertFalse(eventService.completeEvent(2, token));
    }

    @Test
    void testCompleteEvent_InvalidUser() {
        when(userRepository.getIdByToken(token)).thenReturn(null);

        assertFalse(eventService.completeEvent(1, token));
    }


}
