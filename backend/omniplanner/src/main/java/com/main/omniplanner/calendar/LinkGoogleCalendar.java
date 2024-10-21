package com.main.omniplanner.calendar;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
public class LinkGoogleCalendar {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "omniplanner";
    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final String CLIENT_ID = "982652547040-6pftl2ggc47iplud47t9cend8scdclkd.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "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";
    private static final String REDIRECT_URI = "http://localhost:8080";

    @GetMapping("/link_calendar")
    public List<CalendarEvents> getCalendarEvents(@RequestParam String accessToken) {
        System.out.println("access " + accessToken);
        List<CalendarEvents> calendarEventsList = new ArrayList<>();
        try {
            HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

            Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY,
                    request -> request.getHeaders().setAuthorization("Bearer " + accessToken))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            Events events = service.events().list("primary")
                    .setMaxResults(10)
                    .setOrderBy("updated")
                    .setSingleEvents(true)
                    .execute();

            // Map the events to CalendarEvents entities
            for (Event event : events.getItems()) {
                CalendarEvents calendarEvent = new CalendarEvents();

                calendarEvent.setTitle("Google calendar event " + event.getSummary());
                calendarEvent.setDescription(event.getDescription());

                DateTime start = event.getStart().getDateTime() != null ?
                        event.getStart().getDateTime() : event.getStart().getDate();

                if (start != null) {
                    calendarEvent.setEvent_date(new Date(start.getValue()));
                    calendarEvent.setEvent_time(new Time(start.getValue()));
                }

                calendarEventsList.add(calendarEvent);
            }
        } catch (IOException | GeneralSecurityException e) {
            e.printStackTrace();
        }

        return calendarEventsList;
    }
}
