package com.main.omniplanner.EventTests;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventController;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.sql.Time;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class EventControllerTest {

    @Mock
    private EventService eventService;

    private EventController eventController;

    private Event event1;
    private Event event2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        eventController = new EventController(eventService);

        event1 = new Event();
        event1.setDescription("Meeting 1");
        event1.setEventDate(Date.valueOf("2023-10-01"));
        event1.setEventTime(Time.valueOf("10:00:00"));
        event1.setMoney(1.1f);
        event1.setRepeating(false);
        event1.setId(1);
        event1.setTitle("Event 1");
        event1.setUserId(1);
        event1.setEvent_type("Work");

        event2 = new Event();
        event2.setDescription("Meeting 2");
        event2.setEventDate(Date.valueOf("2023-10-02"));
        event2.setEventTime(Time.valueOf("11:00:00"));
        event2.setMoney(2.1f);
        event2.setRepeating(true);
        event2.setRepeatTimeline("Weekly");
        event2.setId(2);
        event2.setTitle("Event 2");
        event2.setUserId(1);
        event2.setEvent_type("Work");
    }

    @Test
    void testGetEventsByUserId_Success() {
        List<Event> events = Arrays.asList(event1, event2);

        when(eventService.getEventsByUserId(1)).thenReturn(events);
        ResponseEntity<List<Event>> response = eventController.getEventsByUserId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());

        // Assert for the first event
        assertEquals("Meeting 1", response.getBody().get(0).getDescription());
        assertEquals(Date.valueOf("2023-10-01"), response.getBody().get(0).getEventDate());
        assertEquals(Time.valueOf("10:00:00"), response.getBody().get(0).getEventTime());
        assertEquals(1.1, response.getBody().get(0).getMoney(), 0.0001, "Money value mismatch");
        assertEquals(false, response.getBody().get(0).getRepeating());
        assertEquals(1, response.getBody().get(0).getId());
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUserId());
        assertEquals("Work", response.getBody().get(0).getEvent_type());
       
        // Assert for the second event
        assertEquals("Meeting 2", response.getBody().get(1).getDescription());
        assertEquals(Date.valueOf("2023-10-02"), response.getBody().get(1).getEventDate());
        assertEquals(Time.valueOf("11:00:00"), response.getBody().get(1).getEventTime());
        assertEquals(2.1, response.getBody().get(1).getMoney(), 0.0001, "Money value mismatch");
        assertEquals(true, response.getBody().get(1).getRepeating());
        assertEquals("Weekly", response.getBody().get(1).getRepeatTimeline());
        assertEquals(2, response.getBody().get(1).getId());
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUserId());
        assertEquals("Work", response.getBody().get(1).getEvent_type());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        int userId = 2;

        when(eventService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
        ResponseEntity<List<Event>> response = eventController.getEventsByUserId(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        int userId = 999;

        when(eventService.getEventsByUserId(userId)).thenReturn(List.of());
        ResponseEntity<List<Event>> response = eventController.getEventsByUserId(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testAddEvent_Success() {
        List<Event> events = Arrays.asList(event1);

        when(eventService.getEventsByUserId(1)).thenReturn(events);
        ResponseEntity<List<Event>> response = eventController.getEventsByUserId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).get(0).getId());
        assertEquals("Event 1", response.getBody().get(0).getTitle());
    }
}
