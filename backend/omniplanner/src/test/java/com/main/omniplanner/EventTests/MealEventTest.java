package com.main.omniplanner.EventTests;

import com.main.omniplanner.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MealEventTest {

    @Mock
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;

    private EventController eventController;
    GenericEvent event1;
    GenericEvent event2;

    UserCalendarInfo userCalendarInfo;
    private String token;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        token = "token";
        userRepository = mock(UserRepository.class);
        eventService = mock(EventService.class);
        eventController = new EventController(eventService, userRepository);
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

        userCalendarInfo= new UserCalendarInfo();
        userCalendarInfo.setId(1);
        userCalendarInfo.setGoogleCalendarLinked(false);
    }

    @Test
    void testGetEventsByUserId_Success() {
        List<GenericEvent> events = Arrays.asList(event1, event2);
        when(userRepository.findUserCalendarInfoByToken(token)).thenReturn(userCalendarInfo);
        when(eventService.getEventsByUserId(1)).thenReturn(events);
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());
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
        when(eventService.getEventsByUserId(2)).thenReturn(List.of());
        when(userRepository.getIdByToken(token)).thenReturn(2);
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(token);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        when(eventService.getEventsByUserId(999)).thenReturn(List.of());
        when(userRepository.getIdByToken(token)).thenReturn(999);
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(token);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }
    @Test
    void testAddEvent_Success() {
        // When
        when(eventService.saveEvent(event1, "Work", token)).thenReturn(event1);

        // Act
        ResponseEntity<GenericEvent> response = eventController.addEvent(event1, "Work", token);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("Event 1", response.getBody().getTitle());
    }

    @Test
    void testUpdateEvent_Success() {
        when(eventService.saveEvent(event1, "Work", token)).thenReturn(event1);
        ResponseEntity<GenericEvent> response = eventController.updateEvent(event1, "Work", token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("Event 1", response.getBody().getTitle());
    }
}
