package com.main.omniplanner.calendar;

import com.main.omniplanner.responses.CalendarEventResponse;
import com.main.omniplanner.user.GenericEvent;
import com.main.omniplanner.user.EventService;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
public class CalendarEventsController {

    @Autowired
    private EventService eventsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LinkGoogleCalendar linkGoogleCalendar;

    @GetMapping("/get_calendar_events/{userId}")
    public ResponseEntity<CalendarEventResponse> getEventsByUserId(@PathVariable int userId) {
        List<GenericEvent> combinedEvents = new ArrayList<>();
        boolean isGoogleCalendarLinked = false;

        try {
            User user = userRepository.findById(userId);

            if (user != null && user.isGoogle_calendar_linked()) {
                isGoogleCalendarLinked = true;
                String accessToken = user.getGoogle_calendar_access_token();

                if (accessToken != null && !accessToken.isEmpty()) {
                    List<GenericEvent> googleEvents = linkGoogleCalendar.getGoogleCalendarEvents(accessToken);
                    combinedEvents.addAll(googleEvents);
                }
            }

            List<GenericEvent> localEvents = eventsService.getEventsByType("calendar", userId);
            combinedEvents.addAll(localEvents);

            CalendarEventResponse response = new CalendarEventResponse(combinedEvents, isGoogleCalendarLinked);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
