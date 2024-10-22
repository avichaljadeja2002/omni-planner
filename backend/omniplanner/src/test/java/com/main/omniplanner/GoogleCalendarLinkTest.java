package com.main.omniplanner;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.main.omniplanner.calendar.CalendarEvents;
import com.main.omniplanner.calendar.LinkGoogleCalendar;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class LinkGoogleCalendarTest {

    @Mock
    private HttpTransport httpTransport;

    @Mock
    private Calendar calendarService;

    @Mock
    private Calendar.Events events;

    @Mock
    private Calendar.Events.List eventsListRequest;

    @Mock
    private Events googleEvents;

    @InjectMocks
    private LinkGoogleCalendar linkGoogleCalendar;

    private static final String ACCESS_TOKEN = "mockAccessToken";

    @BeforeEach
    void setUp() throws GeneralSecurityException, IOException {
        MockitoAnnotations.openMocks(this);
        // Mock HttpTransport initialization
        httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        // Mock Google Calendar service initialization
        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        calendarService = new Calendar.Builder(httpTransport, jsonFactory, request -> {
            request.getHeaders().setAuthorization("Bearer " + ACCESS_TOKEN);
        }).setApplicationName("omniplanner").build();

        // Inject mocks
        linkGoogleCalendar = new LinkGoogleCalendar();
    }

    @Test
    void testGetCalendarEventsWithValidAccessToken() throws IOException {
        // Mock setup
        when(calendarService.events()).thenReturn(events);
        when(events.list(anyString())).thenReturn(eventsListRequest);
        when(eventsListRequest.setMaxResults(anyInt())).thenReturn(eventsListRequest);
        when(eventsListRequest.setOrderBy(anyString())).thenReturn(eventsListRequest);
        when(eventsListRequest.setSingleEvents(anyBoolean())).thenReturn(eventsListRequest);
        when(eventsListRequest.execute()).thenReturn(googleEvents);

        // Prepare mock data
        List<Event> mockEventList = new ArrayList<>();
        Event mockEvent = new Event();
        mockEvent.setSummary("Test Event");
        mockEvent.setDescription("Test Event Description");
        mockEvent.setStart(new Event.DateTime().setDateTime(new com.google.api.client.util.DateTime(System.currentTimeMillis())));
        mockEventList.add(mockEvent);

        when(googleEvents.getItems()).thenReturn(mockEventList);

        // Execute test case
        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents(ACCESS_TOKEN);

        // Assertions
        assertEquals(1, result.size(), "Expected one event to be returned");
        assertEquals("Google calendar event Test Event", result.get(0).getTitle(), "Event title mismatch");
        assertEquals("Test Event Description", result.get(0).getDescription(), "Event description mismatch");
    }

    @Test
    void testGetCalendarEventsWithInvalidAccessToken() throws IOException {
        // Mock setup to throw IOException for invalid token
        when(calendarService.events()).thenReturn(events);
        when(events.list(anyString())).thenReturn(eventsListRequest);
        when(eventsListRequest.setMaxResults(anyInt())).thenReturn(eventsListRequest);
        when(eventsListRequest.setOrderBy(anyString())).thenReturn(eventsListRequest);
        when(eventsListRequest.setSingleEvents(anyBoolean())).thenReturn(eventsListRequest);
        when(eventsListRequest.execute()).thenThrow(new IOException("Invalid token"));

        // Execute test case
        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents("invalidToken");

        // Assertions
        assertTrue(result.isEmpty(), "Expected an empty event list for an invalid token");
    }

    @Test
    void testGetCalendarEventsWithNoEvents() throws IOException {
        // Mock setup for no events
        when(calendarService.events()).thenReturn(events);
        when(events.list(anyString())).thenReturn(eventsListRequest);
        when(eventsListRequest.setMaxResults(anyInt())).thenReturn(eventsListRequest);
        when(eventsListRequest.setOrderBy(anyString())).thenReturn(eventsListRequest);
        when(eventsListRequest.setSingleEvents(anyBoolean())).thenReturn(eventsListRequest);
        when(eventsListRequest.execute()).thenReturn(googleEvents);

        // Mock an empty event list
        when(googleEvents.getItems()).thenReturn(new ArrayList<>());

        // Execute test case
        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents(ACCESS_TOKEN);

        // Assertions
        assertTrue(result.isEmpty(), "Expected an empty event list when no events are present");
    }
}