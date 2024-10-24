package com.main.omniplanner.calendar;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LinkGoogleCalendarTest {

    @InjectMocks
    private LinkGoogleCalendar linkGoogleCalendar;

    @Mock
    private Calendar mockCalendar;

    @Mock
    private Calendar.Events mockEvents;

    @Mock
    private Calendar.Events.List mockEventsListRequest;

    private final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @BeforeEach
    void setUp() throws GeneralSecurityException, IOException {
        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        mockCalendar = new Calendar.Builder(httpTransport, JSON_FACTORY,
                request -> request.getHeaders().setAuthorization("Bearer mockAccessToken"))
                .setApplicationName("omniplanner")
                .build();

        linkGoogleCalendar = new LinkGoogleCalendar();
    }

    @Test
    void testSuccessfulRetrievalOfCalendarEvents() throws IOException {
        // Mock Google Calendar events response
        Events events = new Events();
        List<Event> eventList = new ArrayList<>();

        Event event1 = new Event();
        event1.setSummary("Meeting");
        event1.setDescription("Discuss project progress");
        event1.setStart(new Event.DateTime().setDateTime(new DateTime("2024-10-22T09:00:00-07:00")));
        eventList.add(event1);

        Event event2 = new Event();
        event2.setSummary("Call");
        event2.setDescription("Client call to review requirements");
        event2.setStart(new Event.DateTime().setDateTime(new DateTime("2024-10-23T10:00:00-07:00")));
        eventList.add(event2);

        events.setItems(eventList);

        when(mockCalendar.events()).thenReturn(mockEvents);
        when(mockEvents.list("primary")).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setMaxResults(10)).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setOrderBy("updated")).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setSingleEvents(true)).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.execute()).thenReturn(events);

        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents("mockAccessToken");

        assertEquals(2, result.size());
        assertEquals("Google calendar event Meeting", result.get(0).getTitle());
        assertEquals("Discuss project progress", result.get(0).getDescription());
        assertNotNull(result.get(0).getEvent_date());
        assertNotNull(result.get(0).getEvent_time());
    }

    @Test
    void testInvalidAccessToken() throws IOException {
        // Simulate an error response from Google Calendar
        when(mockCalendar.events()).thenReturn(mockEvents);
        when(mockEvents.list("primary")).thenThrow(new IOException("Invalid access token"));

        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents("invalidAccessToken");

        assertTrue(result.isEmpty());
    }

    @Test
    void testNoEventsInGoogleCalendar() throws IOException {
        // Mock empty events response from Google Calendar
        Events events = new Events();
        events.setItems(new ArrayList<>());

        when(mockCalendar.events()).thenReturn(mockEvents);
        when(mockEvents.list("primary")).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setMaxResults(10)).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setOrderBy("updated")).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setSingleEvents(true)).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.execute()).thenReturn(events);

        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents("mockAccessToken");

        assertTrue(result.isEmpty());
    }

    @Test
    void testPartialEventInformation() throws IOException {
        // Mock partial event information response
        Events events = new Events();
        List<Event> eventList = new ArrayList<>();

        Event event = new Event();
        event.setSummary("Meeting without description");
        event.setStart(new Event.DateTime().setDateTime(new DateTime("2024-10-22T09:00:00-07:00")));
        eventList.add(event);

        events.setItems(eventList);

        when(mockCalendar.events()).thenReturn(mockEvents);
        when(mockEvents.list("primary")).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setMaxResults(10)).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setOrderBy("updated")).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.setSingleEvents(true)).thenReturn(mockEventsListRequest);
        when(mockEventsListRequest.execute()).thenReturn(events);

        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents("mockAccessToken");

        assertEquals(1, result.size());
        assertEquals("Google calendar event Meeting without description", result.get(0).getTitle());
        assertNull(result.get(0).getDescription());
    }

    @Test
    void testGoogleCalendarAPIThrottling() throws IOException {
        // Simulate a rate limit exceeded error from Google Calendar
        when(mockCalendar.events()).thenReturn(mockEvents);
        when(mockEvents.list("primary")).thenThrow(new IOException("Rate Limit Exceeded"));

        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents("mockAccessToken");

        assertTrue(result.isEmpty());
    }

    @Test
    void testNullAccessToken() {
        List<CalendarEvents> result = linkGoogleCalendar.getCalendarEvents(null);

        assertTrue(result.isEmpty());
    }
}
