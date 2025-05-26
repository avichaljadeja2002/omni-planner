package com.main.omniplanner.user;

import com.main.omniplanner.calendar.LinkAdapter;
import com.main.omniplanner.calendar.LinkGoogleCalendar;
import com.main.omniplanner.calendar.LinkImap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
public class EventController {
    @Autowired
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }
    @GetMapping("/get_all_events/{token}")
    public ResponseEntity<List<GenericEvent>> getEventsByUserId(@PathVariable String token) {
        UserCalendarInfo userCalendarInfo = userRepository.findUserCalendarInfoByToken(token);
        if(userCalendarInfo != null) {
            List<GenericEvent> events = eventService.getEventsByUserId(userCalendarInfo.getId());
            Boolean[] isLinked = {userCalendarInfo.isGoogleCalendarLinked(), userCalendarInfo.isImapLinked()};
            LinkGoogleCalendar[] links = {new LinkGoogleCalendar(), new LinkAdapter()};
            String[] accessTokens = {userCalendarInfo.getGoogleCalendarAccessToken(), userCalendarInfo.getImapAccessToken()};
            for(int i = 0; i < 2; i++){
                if(isLinked[i]) {
                    events.addAll(links[i].getGoogleCalendarEvents(accessTokens[i]));
                }  
            }
            return ResponseEntity.ok(events);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/get_events/{event_type}/{token}")
    public ResponseEntity<List<GenericEvent>> getEventsByType(@PathVariable String token, @PathVariable String event_type) {
        Integer userId = userRepository.getIdByToken(token);
        List<GenericEvent> events = eventService.getEventsByType(event_type, userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/add_event/{event_type}/{token}")
    public ResponseEntity<GenericEvent> addEvent(@RequestBody GenericEvent event, @PathVariable String event_type, @PathVariable String token) {
        event.setCompleted(false);
        GenericEvent savedEvent = eventService.saveEvent(event, event_type, token);
        return ResponseEntity.ok(savedEvent);
    }

    @Transactional
    @PutMapping("/update_event/{event_type}/{token}")
    public ResponseEntity<GenericEvent> updateEvent(@RequestBody GenericEvent event, @PathVariable String event_type, @PathVariable String token) {
        GenericEvent updatedEvent = eventService.saveEvent(event, event_type, token);
        return ResponseEntity.ok(updatedEvent);
    }

    @Transactional
    @PutMapping("/complete_event/{eventId}/{token}")
    public ResponseEntity<Boolean> completeEvent(@PathVariable int eventId, @PathVariable String token) {
        boolean updated = eventService.completeEvent(eventId, token);
        if (updated) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(false);
        }
    }

    @DeleteMapping("/delete_event/{eventId}/{token}")
    public ResponseEntity<Boolean> deleteEvent(@PathVariable int eventId, @PathVariable String token) {
        boolean update = eventService.deleteEvent(eventId, token);
        return ResponseEntity.ok(update);
    }
}
