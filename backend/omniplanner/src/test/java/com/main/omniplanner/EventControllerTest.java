package com.main.omniplanner;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventController;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
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

    @InjectMocks
    private EventController eventController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetEventsByUserId_Success() {
        int userId = 1;
        Event event1 = new Event();
        event1.setDescription("Meeting 1");
        event1.setEvent_date(Date.valueOf("2023-10-01"));
        event1.setEvent_time(Time.valueOf("10:00:00"));
        event1.setMoney(1.1);
        event1.setRepeating(false);
        event1.setId(1);
        event1.setTitle("Event 1");
        event1.setUser_id(userId);
        event1.setEventType("Work");

        Event event2 = new Event();
        event2.setDescription("Meeting 2");
        event2.setEvent_date(Date.valueOf("2023-10-02"));
        event2.setEvent_time(Time.valueOf("11:00:00"));
        event2.setMoney(2.1);
        event2.setRepeating(true);
        event2.setRepeat_timeline("Weekly");
        event2.setId(2);
        event2.setTitle("Event 2");
        event2.setUser_id(userId);
        event2.setEventType("Work");

        List<Event> events = Arrays.asList(event1, event2);

        when(eventService.getEventsByUserId(userId)).thenReturn(events);
        ResponseEntity<List<Event>> response = eventController.getEventsByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());

        // Assert for the first event
        assertEquals("Meeting 1", response.getBody().get(0).getDescription());
        assertEquals(Date.valueOf("2023-10-01"), response.getBody().get(0).getEvent_date());
        assertEquals(Time.valueOf("10:00:00"), response.getBody().get(0).getEvent_time());
        assertEquals(1.1, response.getBody().get(0).getMoney());
        assertEquals(false, response.getBody().get(0).getRepeating());
        assertEquals(1, response.getBody().get(0).getId());
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(userId, response.getBody().get(0).getUser_id());
        assertEquals("Work", response.getBody().get(0).getUser_id());
       
        // Assert for the second event
        assertEquals("Meeting 2", response.getBody().get(1).getDescription());
        assertEquals(Date.valueOf("2023-10-02"), response.getBody().get(1).getEvent_date());
        assertEquals(Time.valueOf("11:00:00"), response.getBody().get(1).getEvent_time());
        assertEquals(2.1, response.getBody().get(1).getMoney());
        assertEquals(true, response.getBody().get(1).getRepeating());
        assertEquals("Weekly", response.getBody().get(1).getRepeat_timeline());
        assertEquals(2, response.getBody().get(1).getId());
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(userId, response.getBody().get(1).getUser_id());
        assertEquals("Work", response.getBody().get(1).getEventType());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        int userId = 2;

        when(eventService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
        ResponseEntity<List<Event>> response = eventController.getEventsByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        int userId = 999;

        when(eventService.getEventsByUserId(userId)).thenReturn(List.of());
        ResponseEntity<List<Event>> response = eventController.getEventsByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testAddEvent_Success() {
        // Given
        Event event = new Event();
        event.setDescription("New Meeting");
        event.setEvent_date(Date.valueOf("2023-10-10"));
        event.setEvent_time(Time.valueOf("14:00:00"));
        event.setMoney(5.1);
        event2.setRepeating(true);
        event2.setRepeat_timeline("Weekly");
        event.setId(1);
        event.setTitle("New Finance Event");
        event.setUser_id(1);
        event.setEvent_type("Work");

        // When
        when(eventService.saveEvent(event)).thenReturn(event);

        // Act
        ResponseEntity<Event> response = eventController.addEvent(event);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("New Finance Event", response.getBody().getTitle());
    }
}
