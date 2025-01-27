package com.main.omniplanner.ResponseTests;

import com.main.omniplanner.responses.CalendarEventResponse;
import com.main.omniplanner.user.GenericEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class CalendarEventResponseTest {

    private GenericEvent mockEvent1;
    private GenericEvent mockEvent2;
    private List<GenericEvent> mockEvents;

    @BeforeEach
    public void setUp() {
        // Mock CalendarEvents objects
        mockEvent1 = mock(GenericEvent.class);
        mockEvent2 = mock(GenericEvent.class);

        // Create a list of mocked events
        mockEvents = Arrays.asList(mockEvent1, mockEvent2);
    }

    @Test
    public void testConstructorAndGetters() {
        // Initialize CalendarEventResponse with mocked events
        boolean googleCalendarLinked = true;
        CalendarEventResponse response = new CalendarEventResponse(mockEvents, googleCalendarLinked);

        // Verify that the mocked events list is returned
        assertEquals(mockEvents, response.getEvents());
        assertTrue(response.isGoogleCalendarLinked());

        // Verify interactions with mocked events (if needed)
        Mockito.verifyNoInteractions(mockEvent1);
        Mockito.verifyNoInteractions(mockEvent2);
    }

    @Test
    public void testSetEvents() {
        // Create initial CalendarEventResponse with no events
        CalendarEventResponse response = new CalendarEventResponse(null, false);

        // Set mocked events
        response.setEvents(mockEvents);

        // Verify the events list is updated correctly
        assertEquals(mockEvents, response.getEvents());
    }

    @Test
    public void testSetGoogleCalendarLinked() {
        // Create CalendarEventResponse with googleCalendarLinked initially false
        CalendarEventResponse response = new CalendarEventResponse(null, false);

        // Change googleCalendarLinked value
        response.setGoogleCalendarLinked(true);

        // Verify the value is updated correctly
        assertTrue(response.isGoogleCalendarLinked());
    }

    @Test
    public void testNullEvents() {
        // Create CalendarEventResponse with null events
        CalendarEventResponse response = new CalendarEventResponse(null, true);

        // Verify that getEvents returns null
        assertNull(response.getEvents());
    }

    @Test
    public void testMockEventBehavior() {
        // Example of interacting with mocked CalendarEvents

        // Define behavior for mockEvent1 and mockEvent2
        Mockito.when(mockEvent1.toString()).thenReturn("Mock Event 1");
        Mockito.when(mockEvent2.toString()).thenReturn("Mock Event 2");

        // Verify the mocked behavior
        assertEquals("Mock Event 1", mockEvent1.toString());
        assertEquals("Mock Event 2", mockEvent2.toString());
    }
}
