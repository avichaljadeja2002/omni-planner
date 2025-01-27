package com.main.omniplanner.EventTests;

import com.main.omniplanner.user.EventController;
import com.main.omniplanner.user.EventService;
import com.main.omniplanner.user.GenericEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class MealEventsTest {

    @Mock
    private EventService eventService;

    private EventController eventController;
    GenericEvent event1;
    GenericEvent event2;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        eventController = new EventController(eventService);
        event1 = new GenericEvent();
        event1.setId(1);
        event1.setUserId(1);
        event1.setTitle("Event 1");
        event1.setEvent_date("2023-10-01");
        event1.setEvent_time("10:00:00");

        event2 = new GenericEvent();
        event2.setId(2);
        event2.setUserId(1);
        event2.setTitle("Event 2");
        event2.setEvent_date("2023-10-02");
        event2.setEvent_time("11:00:00");
    }

    @Test
    void testGetEventsByUserId_Success() {
        List<GenericEvent> events = Arrays.asList(event1, event2);

        when(eventService.getEventsByUserId(1)).thenReturn(events);
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());
        // Assert for the first event
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUserId());
        assertEquals("2023-10-01", response.getBody().get(0).getEvent_date());
        assertEquals("10:00:00", response.getBody().get(0).getEvent_time());
       
        // Assert for the second event
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUserId());
        assertEquals("2023-10-02", response.getBody().get(1).getEvent_date());
        assertEquals("11:00:00", response.getBody().get(1).getEvent_time());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        when(eventService.getEventsByUserId(2)).thenReturn(Arrays.asList());
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        when(eventService.getEventsByUserId(999)).thenReturn(Arrays.asList());
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(999);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }
    @Test
    void testAddEvent_Success() {
        // When
        when(eventService.saveEvent(event1, "Work")).thenReturn(event1);

        // Act
        ResponseEntity<GenericEvent> response = eventController.addEvent(event1, "Work");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("Event 1", response.getBody().getTitle());
    }

    @Test
    void testUpdateEvent_Success() {
        when(eventService.saveEvent(event1, "Work")).thenReturn(event1);
        ResponseEntity<GenericEvent> response = eventController.updateEvent(event1, "Work");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("Event 1", response.getBody().getTitle());
    }
}
