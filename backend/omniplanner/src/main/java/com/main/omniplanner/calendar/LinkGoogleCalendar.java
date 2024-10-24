package com.main.omniplanner.calendar;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.main.omniplanner.requests.CalendarLinkRequest;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/link_calendar")
    public String linkCalendar(@RequestBody CalendarLinkRequest request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setGoogle_calendar_linked(true);
            user.setGoogle_calendar_access_token(request.getAccessToken());
            userRepository.save(user);
            return "Google Calendar linked successfully for user ID: " + request.getUserId();
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to link Google Calendar for user ID: " + request.getUserId();
        }
    }

    @GetMapping("/get_google_calendar_events")
    public List<CalendarEvents> getGoogleCalendarEvents(@RequestParam String access_token) {
        List<CalendarEvents> calendarEventsList = new ArrayList<>();
        try {
            HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY,
                    request -> request.getHeaders().setAuthorization("Bearer " + access_token))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            Events events = service.events().list("primary")
                    .setMaxResults(10)
                    .setOrderBy("updated")
                    .setSingleEvents(true)
                    .execute();

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
