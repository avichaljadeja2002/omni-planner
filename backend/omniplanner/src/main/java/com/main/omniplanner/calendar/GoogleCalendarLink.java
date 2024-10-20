package com.main.omniplanner.calendar;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Calendar;
import java.util.List;

@RestController
public class GoogleCalendarController {

    private static final String APPLICATION_NAME = "Web Client";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @PostMapping("/link_calendar")
    public List<CalendarEvents> linkCalendar(@RequestParam("access_token") String accessToken) {
        try {
            // Build a new authorized API client service using the access token
            Calendar service = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    request -> request.setAuthorization("Bearer " + accessToken))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            // Fetch events from the primary calendar
            String calendarId = "primary";
            Calendar events = service.events().list(calendarId)
                    .setMaxResults(10)
                    .setOrderBy("startTime")
                    .setSingleEvents(true)
                    .execute();
            System.out.println(events);
            return null;
        } catch (IOException | GeneralSecurityException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve calendar events.");
        }
    }
}
