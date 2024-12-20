package com.main.omniplanner.calendar;

import com.main.omniplanner.responses.CalendarEventResponse;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import jakarta.transaction.Transactional;
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
    private CalendarEventsService calendarEventsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LinkGoogleCalendar linkGoogleCalendar;

    @PostMapping("/add_calendar_event")
    public ResponseEntity<CalendarEvents> addEvent(@RequestBody CalendarEvents event) {
        CalendarEvents savedEvent = calendarEventsService.saveEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    @GetMapping("/get_calendar_events/{userId}")
    public ResponseEntity<CalendarEventResponse> getEventsByUserId(@PathVariable int userId) {
        List<CalendarEvents> combinedEvents = new ArrayList<>();
        boolean isGoogleCalendarLinked = false;

        try {
            User user = userRepository.findById(userId);

            if (user != null && user.isGoogle_calendar_linked()) {
                isGoogleCalendarLinked = true;
                String accessToken = user.getGoogle_calendar_access_token();

                if (accessToken != null && !accessToken.isEmpty()) {
                    List<CalendarEvents> googleEvents = linkGoogleCalendar.getGoogleCalendarEvents(accessToken);
                    combinedEvents.addAll(googleEvents);
                }
            }

            List<CalendarEvents> localEvents = calendarEventsService.getEventsByUserId(userId);
            combinedEvents.addAll(localEvents);

            CalendarEventResponse response = new CalendarEventResponse(combinedEvents, isGoogleCalendarLinked);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @PutMapping("/update_calendar_event")
    public ResponseEntity<CalendarEvents> updateEvent(@RequestBody CalendarEvents event) {
        calendarEventsService.updateEvent(event);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }
}
