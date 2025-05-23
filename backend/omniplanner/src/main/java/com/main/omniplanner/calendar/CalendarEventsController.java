package com.main.omniplanner.calendar;

import com.main.omniplanner.notes.NotesService;
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
import java.util.Optional;

@RestController
@CrossOrigin
public class CalendarEventsController {

    @Autowired
    private EventService eventsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LinkGoogleCalendar linkGoogleCalendar;

    @Autowired
    private LinkImap linkImap;

    public CalendarEventsController(EventService eventService, UserRepository userRepository) {
        this.eventsService = eventService;
        this.userRepository = userRepository;
    }

    @GetMapping("/get_calendar_events/{token}")
    public ResponseEntity<CalendarEventResponse> getEventsByToken(@PathVariable String token) {
        Integer userId = userRepository.getIdByToken(token);
        List<GenericEvent> combinedEvents = new ArrayList<>();
        boolean isGoogleCalendarLinked = false;
        boolean isImapLinked = false;

        try {
            Optional<User> user = userRepository.findById(String.valueOf(userId));

            if (user.isPresent() && user.get().isGoogleCalendarLinked()) {
                isGoogleCalendarLinked = true;
                String accessToken = user.get().getGoogleCalendarAccessToken();

                if (accessToken != null && !accessToken.isEmpty()) {
                    List<GenericEvent> googleEvents = linkGoogleCalendar.getGoogleCalendarEvents(accessToken);
                    combinedEvents.addAll(googleEvents);
                }
            }

            if (user.isPresent() && user.get().isImapLinked()) {
                isImapLinked = true;
                String accessToken = user.get().getImapAccessToken();

                if (accessToken != null && !accessToken.isEmpty()) {
                    List<GenericEvent> imapEvents = linkImap.getImapEvents(accessToken);
                    combinedEvents.addAll(imapEvents);
                }
            }

            List<GenericEvent> localEvents = eventsService.getEventsByType("calendar", userId);
            combinedEvents.addAll(localEvents);

            CalendarEventResponse response = new CalendarEventResponse(combinedEvents, isGoogleCalendarLinked, isImapLinked);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error serializing response: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
