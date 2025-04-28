package com.main.omniplanner.EventTests;

import com.main.omniplanner.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventControllerTest {

    @Mock
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;

    private EventController eventController;

    private GenericEvent event1;
    private GenericEvent event2;
    String token;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userRepository = mock(UserRepository.class);
        eventService = mock(EventService.class);
        eventController = new EventController(eventService, userRepository);
        token = "1a2b3c4d";

        event1 = new GenericEvent();
        event1.setDescription("Meeting 1");
        event1.setEvent_date("2023-10-01");
        event1.setEvent_time("10:00:00");
        event1.setMoney(1.1f);
        event1.setRepeating(false);
        event1.setId(1);
        event1.setTitle("Event 1");
        event1.setUserId(1);
        event1.setEvent_type("Work");

        event2 = new GenericEvent();
        event2.setDescription("Meeting 2");
        event2.setEvent_date("2023-10-02");
        event2.setEvent_time("11:00:00");
        event2.setMoney(2.1f);
        event2.setRepeating(true);
        event2.setRepeat_timeline(2);
        event2.setId(2);
        event2.setTitle("Event 2");
        event2.setUserId(1);
        event2.setEvent_type("Work");
    }

    @Test
    void testGetEventsByUserId_Success() {
        List<GenericEvent> events = Arrays.asList(event1, event2);
        UserCalendarInfo userCalendarInfo = new UserCalendarInfo();
        userCalendarInfo.setId(1);
        userCalendarInfo.setGoogleCalendarLinked(false);

        when(userRepository.findUserCalendarInfoByToken(token)).thenReturn(userCalendarInfo);
        when(eventService.getEventsByUserId(1)).thenReturn(events);
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());

        assertEquals("Meeting 1", response.getBody().get(0).getDescription());
        assertEquals("2023-10-01", response.getBody().get(0).getEvent_date());
        assertEquals("10:00:00", response.getBody().get(0).getEvent_time());
        assertEquals(1.1, response.getBody().get(0).getMoney(), 0.0001, "Money value mismatch");
        assertEquals(false, response.getBody().get(0).getRepeating());
        assertEquals(1, response.getBody().get(0).getId());
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUserId());
        assertEquals("Work", response.getBody().get(0).getEvent_type());

        assertEquals("Meeting 2", response.getBody().get(1).getDescription());
        assertEquals("2023-10-02", response.getBody().get(1).getEvent_date());
        assertEquals("11:00:00", response.getBody().get(1).getEvent_time());
        assertEquals(2.1, response.getBody().get(1).getMoney(), 0.0001, "Money value mismatch");
        assertEquals(true, response.getBody().get(1).getRepeating());
        assertEquals(2, response.getBody().get(1).getRepeat_timeline());
        assertEquals(2, response.getBody().get(1).getId());
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUserId());
        assertEquals("Work", response.getBody().get(1).getEvent_type());

    }
    @Test
    void testGetEventsByUserId_EmptyList() {
        int userId = 1;
        UserCalendarInfo userCalendarInfo = new UserCalendarInfo();
        userCalendarInfo.setId(userId);
        userCalendarInfo.setGoogleCalendarLinked(false);

        when(userRepository.findUserCalendarInfoByToken(token)).thenReturn(userCalendarInfo);
        when(eventService.getEventsByUserId(userId)).thenReturn(List.of());
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, Objects.requireNonNull(response.getBody()).size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        when(userRepository.findUserCalendarInfoByToken(token)).thenReturn(null);
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(token);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
        }

    @Test
    void testGetEventsByType_Success() {
        List<GenericEvent> events = Arrays.asList(event1, event2);
        when(userRepository.getIdByToken(token)).thenReturn(1);
        when(eventService.getEventsByType("Work", 1)).thenReturn(events);
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByType(token, "Work");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());

        // Assert for the first event
        assertEquals("Meeting 1", response.getBody().get(0).getDescription());
        assertEquals("2023-10-01", response.getBody().get(0).getEvent_date());
        assertEquals("10:00:00", response.getBody().get(0).getEvent_time());
        assertEquals(1.1, response.getBody().get(0).getMoney(), 0.0001, "Money value mismatch");
        assertEquals(false, response.getBody().get(0).getRepeating());
        assertEquals(1, response.getBody().get(0).getId());
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUserId());
        assertEquals("Work", response.getBody().get(0).getEvent_type());

        // Assert for the second event
        assertEquals("Meeting 2", response.getBody().get(1).getDescription());
        assertEquals("2023-10-02", response.getBody().get(1).getEvent_date());
        assertEquals("11:00:00", response.getBody().get(1).getEvent_time());
        assertEquals(2.1, response.getBody().get(1).getMoney(), 0.0001, "Money value mismatch");
        assertEquals(true, response.getBody().get(1).getRepeating());
        assertEquals(2, response.getBody().get(1).getRepeat_timeline());
        assertEquals(2, response.getBody().get(1).getId());
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUserId());
        assertEquals("Work", response.getBody().get(1).getEvent_type());
    }

    @Test
    void testGetEventsByType_EmptyList() {
        when(userRepository.getIdByToken(token)).thenReturn(2);
        when(eventService.getEventsByType("Work", 2)).thenReturn(List.of());
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByType(token, "Work");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, Objects.requireNonNull(response.getBody()).size());
    }

    @Test
    void testGetEventsByType_NonExistingUser() {
        Integer userId = 999;
        when(userRepository.getIdByToken(token)).thenReturn(userId);
        when(eventService.getEventsByType("Work", userId)).thenReturn(List.of());
        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByType(token, "Work");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, Objects.requireNonNull(response.getBody()).size());
    }

    @Test
    void testAddEvent_Success() {
        GenericEvent event1 = new GenericEvent();
        event1.setId(1);
        event1.setTitle("Event 1");
        List<GenericEvent> events = List.of(event1);

        UserCalendarInfo userCalendarInfo = new UserCalendarInfo();
        userCalendarInfo.setId(1);
        userCalendarInfo.setGoogleCalendarLinked(false);

        // Configure mocks
        when(userRepository.findUserCalendarInfoByToken(token)).thenReturn(userCalendarInfo);
        when(eventService.getEventsByUserId(1)).thenReturn(events);

        ResponseEntity<List<GenericEvent>> response = eventController.getEventsByUserId(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(1, response.getBody().get(0).getId());
        assertEquals("Event 1", response.getBody().get(0).getTitle());
    }
}
