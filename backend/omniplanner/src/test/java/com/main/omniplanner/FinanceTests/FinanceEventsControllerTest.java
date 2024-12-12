package com.main.omniplanner.FinanceTests;

import com.main.omniplanner.finance.FinanceEvents;
import com.main.omniplanner.finance.FinanceEventsController;
import com.main.omniplanner.finance.FinanceEventsService;
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

class FinanceEventsControllerTest {

    @Mock
    private FinanceEventsService financeEventsService;

    private FinanceEventsController financeEventsController;

    private FinanceEvents event1;
    private FinanceEvents event2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        financeEventsController = new FinanceEventsController(financeEventsService);

        event1 = new FinanceEvents();
        event1.setId(1);
        event1.setUser_id(1);
        event1.setTitle("Event 1");
        event1.setEvent_date(Date.valueOf("2023-10-01"));
        event1.setEvent_time(Time.valueOf("10:00:00"));
        event1.setRepeating(false);
        event1.setMoney(1.1);

        event2 = new FinanceEvents();
        event2.setId(2);
        event2.setUser_id(1);
        event2.setTitle("Event 2");
        event2.setEvent_date(Date.valueOf("2023-10-02"));
        event2.setEvent_time(Time.valueOf("11:00:00"));
        event2.setRepeating(true);
        event2.setRepeat_timeline("Weekly");
        event2.setMoney(2.1);
    }

    @Test
    void testGetEventsByUserId_Success() {
        List<FinanceEvents> events = Arrays.asList(event1, event2);

        when(financeEventsService.getEventsByUserId(1)).thenReturn(events);
        ResponseEntity<List<FinanceEvents>> response = financeEventsController.getEventsByUserId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());
       
        // Assert for the first event
        assertEquals("Event 1", response.getBody().get(0).getTitle());
        assertEquals(1, response.getBody().get(0).getUser_id());
        assertEquals(Date.valueOf("2023-10-01"), response.getBody().get(0).getEvent_date());
        assertEquals(Time.valueOf("10:00:00"), response.getBody().get(0).getEvent_time());
        assertFalse(response.getBody().get(0).isRepeating());
        assertNull(response.getBody().get(0).getRepeat_timeline());
        assertEquals(1.1, response.getBody().get(0).getMoney());
       
        // Assert for the second event
        assertEquals("Event 2", response.getBody().get(1).getTitle());
        assertEquals(1, response.getBody().get(1).getUser_id());
        assertEquals(Date.valueOf("2023-10-02"), response.getBody().get(1).getEvent_date());
        assertEquals(Time.valueOf("11:00:00"), response.getBody().get(1).getEvent_time());
        assertTrue(response.getBody().get(1).isRepeating());
        assertEquals("Weekly", response.getBody().get(1).getRepeat_timeline());
        assertEquals(2.1, response.getBody().get(1).getMoney());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        int userId = 2;

        when(financeEventsService.getEventsByUserId(userId)).thenReturn(Arrays.asList());
        ResponseEntity<List<FinanceEvents>> response = financeEventsController.getEventsByUserId(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        int userId = 999;

        when(financeEventsService.getEventsByUserId(userId)).thenReturn(List.of());
        ResponseEntity<List<FinanceEvents>> response = financeEventsController.getEventsByUserId(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testAddEvent_Success() {
        // When
        when(financeEventsService.saveEvent(event1)).thenReturn(event1);

        // Act
        ResponseEntity<FinanceEvents> response = financeEventsController.addEvent(event1);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("Event 1", response.getBody().getTitle());
    }
}
