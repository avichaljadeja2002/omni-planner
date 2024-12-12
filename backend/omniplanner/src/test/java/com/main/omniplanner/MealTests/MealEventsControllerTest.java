package com.main.omniplanner.MealTests;

import com.main.omniplanner.meals.MealEvents;
import com.main.omniplanner.meals.MealEventsController;
import com.main.omniplanner.meals.MealEventsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.sql.Time;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class MealEventsControllerTest {

    @Mock
    private MealEventsService mealEventsService;

    @InjectMocks
    private MealEventsController mealEventsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetEventsByUserId_Success() {
        int userId = 1;
        MealEvents event1 = new MealEvents();
        event1.setId(1);
        event1.setUser_id(userId);
        event1.setTitle("Event 1");
        event1.setEvent_date(Date.valueOf("2023-10-01"));
        event1.setEvent_time(Time.valueOf("10:00:00"));

        MealEvents event2 = new MealEvents();
        event2.setId(2);
        event2.setUser_id(userId);
        event2.setTitle("Event 2");
        event2.setEvent_date(Date.valueOf("2023-10-02"));
        event2.setEvent_time(Time.valueOf("11:00:00"));

        List<MealEvents> events = Arrays.asList(event1, event2);

        when(mealEventsService.getEventsByUserId(userId)).thenReturn(events);
        ResponseEntity<List<MealEvents>> response = mealEventsController.getEventsByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());
        // Assert for the first event
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUser_id());
        assertEquals(Date.valueOf("2023-10-01"), response.getBody().get(0).getEvent_date());
        assertEquals(Time.valueOf("10:00:00"), response.getBody().get(0).getEvent_time());
       
        // Assert for the second event
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUser_id());
        assertEquals(Date.valueOf("2023-10-02"), response.getBody().get(1).getEvent_date());
        assertEquals(Time.valueOf("11:00:00"), response.getBody().get(1).getEvent_time());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        int userId = 2;

        when(mealEventsService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
        ResponseEntity<List<MealEvents>> response = mealEventsController.getEventsByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        int userId = 999;

        when(mealEventsService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
        ResponseEntity<List<MealEvents>> response = mealEventsController.getEventsByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }
    @Test
    void testAddEvent_Success() {
        // Given
        MealEvents event = new MealEvents();
        event.setId(1);
        event.setUser_id(1);
        event.setTitle("New Meal Event");
        event.setEvent_date(Date.valueOf("2023-10-10"));
        event.setEvent_time(Time.valueOf("14:00:00"));

        // When
        when(mealEventsService.saveEvent(event)).thenReturn(event);

        // Act
        ResponseEntity<MealEvents> response = mealEventsController.addEvent(event);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("New Meal Event", response.getBody().getTitle());
    }
}
