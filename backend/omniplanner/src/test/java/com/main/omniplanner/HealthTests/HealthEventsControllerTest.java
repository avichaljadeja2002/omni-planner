package com.main.omniplanner.HealthTests;

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
    private HealthEventsService healthEventsService;

    private HealthEventsController healthEventsController;

    private HealthEvents event1;
    private HealthEvents event2;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        healthEventsController = new HealthEventsController(healthEventsService);

        event1 = new HealthEvents();
        event1.setId(1);
        event1.setUserId(1);
        event1.setTitle("Event 1");
        event1.setEvent_date(Date.valueOf("2023-10-01"));
        event1.setEvent_time(Time.valueOf("10:00:00"));
        event1.setRepeating(false);

        event2 = new HealthEvents();
        event2.setId(2);
        event2.setUserId(1);
        event2.setTitle("Event 2");
        event2.setEvent_date(Date.valueOf("2023-10-02"));
        event2.setEvent_time(Time.valueOf("11:00:00"));
        event2.setRepeating(true);
        event2.setRepeat_timeline("Weekly");
    }

    @Test
    void testGetEventsByUserId_Success() {
        List<HealthEvents> events = Arrays.asList(event1, event2);

        // When
        when(healthEventsService.getEventsByUserId(1)).thenReturn(events);
        ResponseEntity<List<HealthEvents>> response = healthEventsController.getEventsByUserId(1);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());
        // Assert for the first event
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUserId());
        assertEquals(Date.valueOf("2023-10-01"), response.getBody().get(0).getEvent_date());
        assertEquals(Time.valueOf("10:00:00"), response.getBody().get(0).getEvent_time());
        assertFalse(response.getBody().get(0).isRepeating());
        assertNull(response.getBody().get(0).getRepeat_timeline());
       
        // Assert for the second event
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUserId());
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
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }
    @Test
    void testAddEvent_Success() {
        // When
        when(healthEventsService.saveEvent(event1)).thenReturn(event1);

        // Act
        ResponseEntity<HealthEvents> response = healthEventsController.addEvent(event1);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("Event 1", response.getBody().getTitle());
    }
}
