package com.main.omniplanner.CalendarTests;

import com.main.omniplanner.calendar.CalendarEvents;
import com.main.omniplanner.calendar.CalendarEventsController;
import com.main.omniplanner.calendar.CalendarEventsService;
import com.main.omniplanner.responses.CalendarEventResponse;
import com.main.omniplanner.user.UserRepository;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class CalendarEventsControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CalendarEventsService calendarEventsService;

    @InjectMocks
    private CalendarEventsController calendarEventsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetEventsByUserId_Success() {
        int userId = 1;
        CalendarEvents event1 = new CalendarEvents();
        event1.setId(1);
        event1.setUserId(userId);
        event1.setTitle("Event 1");
        event1.setEvent_date(Date.valueOf("2023-10-01"));
        event1.setEvent_time(Time.valueOf("10:00:00"));
        event1.setRepeating(false);
        event1.setDescription("Description 1");

        CalendarEvents event2 = new CalendarEvents();
        event2.setId(2);
        event2.setUserId(userId);
        event2.setTitle("Event 2");
        event2.setEvent_date(Date.valueOf("2023-10-02"));
        event2.setEvent_time(Time.valueOf("11:00:00"));
        event2.setRepeating(true);
        event2.setRepeat_timeline("Weekly");
        event2.setDescription("Description 2");

        List<CalendarEvents> events = Arrays.asList(event1, event2);

        when(calendarEventsService.getEventsByUserId(userId)).thenReturn(events);
        ResponseEntity<CalendarEventResponse> response = calendarEventsController.getEventsByUserId(userId);
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(Objects.requireNonNull(response.getBody()).getEvents()).size());

        assertEquals("Event 1", response.getBody().getEvents().get(0).getTitle());
        assertEquals("Description 1", response.getBody().getEvents().get(0).getDescription());
        assertEquals(1, response.getBody().getEvents().get(0).getUserId());
        System.out.println(response.getBody().getEvents().get(0).getEvent_date());
        System.out.println(response.getBody().getEvents().get(0).getEvent_time());
        System.out.println(response.getBody().getEvents().get(0).isRepeating());
        System.out.println(response.getBody().getEvents().get(0).getRepeat_timeline());

        assertEquals("Event 2", response.getBody().getEvents().get(1).getTitle());
        assertEquals("Description 2", response.getBody().getEvents().get(1).getDescription());
        assertEquals(1, response.getBody().getEvents().get(1).getUserId());
        System.out.println(response.getBody().getEvents().get(1).getEvent_date());
        System.out.println(response.getBody().getEvents().get(1).getEvent_time());
        System.out.println(response.getBody().getEvents().get(1).isRepeating());
        System.out.println(response.getBody().getEvents().get(1).getRepeat_timeline());

    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        // Given
        int userId = 2;

        // When
        when(calendarEventsService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
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
        when(calendarEventsService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
        ResponseEntity<CalendarEventResponse> response = calendarEventsController.getEventsByUserId(userId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().getEvents().size());
    }

  @Test
    void testGetEventsByUserId_ExceptionThrown() {
        int userId = 1;

        when(userRepository.findById(userId)).thenThrow(new RuntimeException("Database error"));

        ResponseEntity<CalendarEventResponse> response = calendarEventsController.getEventsByUserId(userId);

        assertEquals(500, response.getStatusCodeValue());
    }

    @Test
    void testAddEvent_Success() {
        // Given
        CalendarEvents event = new CalendarEvents();
        event.setId(1);
        event.setUserId(1);
        event.setTitle("New Event");
        event.setEvent_date(Date.valueOf("2023-10-10"));
        event.setEvent_time(Time.valueOf("14:00:00"));

        // When
        when(calendarEventsService.saveEvent(event)).thenReturn(event);

        // Act
        ResponseEntity<CalendarEvents> response = calendarEventsController.addEvent(event);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("New Event", response.getBody().getTitle());
    }

    @Test
    void updateEvent_Success() {
        // Given
        CalendarEvents event = new CalendarEvents();
        event.setId(1);
        event.setUserId(1);
        event.setTitle("New Event");
        event.setEvent_date(Date.valueOf("2023-10-10"));
        event.setEvent_time(Time.valueOf("14:00:00"));

        ResponseEntity<CalendarEvents> response = calendarEventsController.updateEvent(event);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("New Event", response.getBody().getTitle());
    }


}
