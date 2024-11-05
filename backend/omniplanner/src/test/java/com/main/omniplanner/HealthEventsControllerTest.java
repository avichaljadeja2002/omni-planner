package com.main.omniplanner;

import com.main.omniplanner.health.HealthEvents;
import com.main.omniplanner.health.HealthEventsController;
import com.main.omniplanner.health.HealthEventsService;
import org.junit.jupiter.api.BeforeEach;
import com.main.omniplanner.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.sql.Date;
import java.sql.Time;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class HealthEventsControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private HealthEventsService healthEventsService;

    @InjectMocks
    private HealthEventsController healthEventsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetEventsByUserId_Success() {
        //Given data
        int userId = 1;
        HealthEvents event1 = new HealthEvents();
        event1.setId(1);
        event1.setUser_id(userId);
        event1.setTitle("Event 1");
        event1.setEvent_date(Date.valueOf("2023-10-01"));
        event1.setEvent_time(Time.valueOf("10:00:00"));
        event1.setRepeating(false);

        HealthEvents event2 = new HealthEvents();
        event2.setId(2);
        event2.setUser_id(userId);
        event2.setTitle("Event 2");
        event2.setEvent_date(Date.valueOf("2023-10-02"));
        event2.setEvent_time(Time.valueOf("11:00:00"));
        event2.setRepeating(true);
        event2.setRepeat_timeline("Weekly");

        List<HealthEvents> events = Arrays.asList(event1, event2);

        // When
        when(healthEventsService.getEventsByUserId(userId)).thenReturn(events);
        ResponseEntity<List<HealthEvents>> response = healthEventsController.getEventsByUserId(userId);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());
        // Assert for the first event
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUser_id());
        assertEquals(Date.valueOf("2023-10-01"), response.getBody().get(0).getEvent_date());
        assertEquals(Time.valueOf("10:00:00"), response.getBody().get(0).getEvent_time());
        assertFalse(response.getBody().get(0).isRepeating());
        assertNull(response.getBody().get(0).getRepeat_timeline());
       
        // Assert for the second event
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUser_id());
        assertEquals(Date.valueOf("2023-10-02"), response.getBody().get(1).getEvent_date());
        assertEquals(Time.valueOf("11:00:00"), response.getBody().get(1).getEvent_time());
        assertTrue(response.getBody().get(1).isRepeating());
        assertEquals("Weekly", response.getBody().get(1).getRepeat_timeline());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        // Given
        int userId = 2;

        // When
        when(healthEventsService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
        ResponseEntity<List<HealthEvents>> response = healthEventsController.getEventsByUserId(userId);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }
    @Test
    void testAddEvent_Success() {
        // Given
        HealthEvents event = new HealthEvents();
        event.setId(1);
        event.setUser_id(1);
        event.setTitle("New Health Event");
        event.setEvent_date(Date.valueOf("2023-10-10"));
        event.setEvent_time(Time.valueOf("14:00:00"));

        // When
        when(healthEventsService.saveEvent(event)).thenReturn(event);

        // Act
        ResponseEntity<HealthEvents> response = healthEventsController.addEvent(event);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("New Health Event", response.getBody().getTitle());
    }
}
