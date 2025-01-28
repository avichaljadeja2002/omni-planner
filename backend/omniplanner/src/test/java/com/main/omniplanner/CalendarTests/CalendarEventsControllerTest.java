package com.main.omniplanner.CalendarTests;

import com.main.omniplanner.calendar.CalendarEventsController;
import com.main.omniplanner.responses.CalendarEventResponse;
import com.main.omniplanner.user.EventController;
import com.main.omniplanner.user.EventService;
import com.main.omniplanner.user.GenericEvent;
import com.main.omniplanner.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class CalendarEventsControllerTest {

    @Mock
    private UserRepository userRepository;

    private EventController eventController;

    @Mock
    private EventService eventService;

    @InjectMocks
    private CalendarEventsController calendarEventsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        eventController = new EventController(eventService);
    }

    @Test
    void testGetEventsByUserId_Success() {
        int userId = 1;
        GenericEvent event1 = new GenericEvent();
        event1.setId(1);
        event1.setUserId(userId);
        event1.setTitle("Event 1");
        event1.setEvent_date("2023-10-01");
        event1.setEvent_time("10:00:00");
        event1.setRepeating(false);
        event1.setDescription("Description 1");

        GenericEvent event2 = new GenericEvent();
        event2.setId(2);
        event2.setUserId(userId);
        event2.setTitle("Event 2");
        event2.setEvent_date("2023-10-02");
        event2.setEvent_time("11:00:00");
        event2.setRepeating(true);
        event2.setRepeat_timeline(2);
        event2.setDescription("Description 2");

        List<GenericEvent> events = Arrays.asList(event1, event2);

        when(eventService.getEventsByType("calendar", userId)).thenReturn(events);
        ResponseEntity<CalendarEventResponse> response = calendarEventsController.getEventsByUserId(userId);
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(Objects.requireNonNull(response.getBody()).getEvents()).size());

        assertEquals("Event 1", response.getBody().getEvents().get(0).getTitle());
        assertEquals("Description 1", response.getBody().getEvents().get(0).getDescription());
        assertEquals(1, response.getBody().getEvents().get(0).getUserId());

        assertEquals("Event 2", response.getBody().getEvents().get(1).getTitle());
        assertEquals("Description 2", response.getBody().getEvents().get(1).getDescription());
        assertEquals(1, response.getBody().getEvents().get(1).getUserId());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        // Given
        int userId = 2;

        // When
        when(eventService.getEventsByType("calendar", userId)).thenReturn(Arrays.asList());
        ResponseEntity<CalendarEventResponse> response = calendarEventsController.getEventsByUserId(userId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().getEvents().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        // Given
        int userId = 999; // Assuming this user doesn't exist

        // When
        when(eventService.getEventsByType("calendar", userId)).thenReturn(Arrays.asList());
        ResponseEntity<CalendarEventResponse> response = calendarEventsController.getEventsByUserId(userId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().getEvents().size());
    }

  @Test
    void testGetEventsByUserId_ExceptionThrown() {
        int userId = 1;

        when(userRepository.findById(String.valueOf(userId))).thenThrow(new RuntimeException("Database error"));

        ResponseEntity<CalendarEventResponse> response = calendarEventsController.getEventsByUserId(userId);

        assertEquals(500, response.getStatusCodeValue());
    }
}
