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
import com.main.omniplanner.user.GenericEvent;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
public class LinkGoogleCalendar {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "omniplanner";

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/link_calendar/{token}")
    public String linkCalendar(@RequestBody CalendarLinkRequest request, @PathVariable String token) {
        Integer userId = userRepository.getIdByToken(token);
        try {
            System.out.println("Linking Google Calendar for user ID: " + userId);
            User user = userRepository.findById(String.valueOf(userId))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setGoogleCalendarLinked(true);
            user.setGoogleCalendarAccessToken(request.getAccessToken());
            userRepository.save(user);
            return "Google Calendar linked successfully for user ID: " + userId;
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to link Google Calendar for user ID: " + userId;
        }
    }

    @GetMapping("/get_google_calendar_events")
    public List<GenericEvent> getGoogleCalendarEvents(@RequestParam String access_token) {
        List<GenericEvent> calendarEventsList = new ArrayList<>();
        try {
            HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY,
                    request -> request.getHeaders().setAuthorization("Bearer " + access_token))
                    .setApplicationName(APPLICATION_NAME)
                    .build();
            long currentTimeMillis = System.currentTimeMillis();
            DateTime now = new DateTime(currentTimeMillis);
            Events events = service.events().list("primary")
                    .setMaxResults(10)
                    .setOrderBy("updated")
                    .setSingleEvents(true)
                    .setTimeMin(now)
                    .execute();

            int loopLimit = Math.min(events.getItems().size(), 10); // If size is less than 10, use the size, else 10
            for (int i = 0; i < loopLimit; i++) {
                Event event = events.getItems().get(i);
                GenericEvent calendarEvent = new GenericEvent();

                calendarEvent.setId(i);
                calendarEvent.setTitle("Google: " + event.getSummary());
                calendarEvent.setEvent_type("google_calendar");
                calendarEvent.setDescription(event.getDescription());

                LocalDate currentDate = LocalDate.now();
                LocalTime currentTime = LocalTime.now();
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                String formattedDate = currentDate.format(dateFormatter);
                String formattedTime = currentTime.format(timeFormatter);

                if (currentDate != null) {
                    calendarEvent.setEvent_date(formattedDate); // Set the formatted String
                    calendarEvent.setEvent_time(formattedTime);
                    calendarEventsList.add(calendarEvent);
                }
            }
        } catch (IOException | GeneralSecurityException e) {
            e.printStackTrace();
        }
        return calendarEventsList;
    }
}
