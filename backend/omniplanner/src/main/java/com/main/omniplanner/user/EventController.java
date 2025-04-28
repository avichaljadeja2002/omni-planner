package com.main.omniplanner.user;

import com.main.omniplanner.calendar.LinkGoogleCalendar;
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

    @Autowired
    private LinkGoogleCalendar linkGoogleCalendar;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }
    @GetMapping("/get_all_events/{token}")
    public ResponseEntity<List<GenericEvent>> getEventsByUserId(@PathVariable String token) {
        UserCalendarInfo userCalendarInfo = userRepository.findUserCalendarInfoByToken(token);
        if(userCalendarInfo != null) {
            List<GenericEvent> events = eventService.getEventsByUserId(userCalendarInfo.getId());
            if(userCalendarInfo.isGoogleCalendarLinked()) {
                List<GenericEvent> calendarEvents = linkGoogleCalendar.getGoogleCalendarEvents(userCalendarInfo.getGoogleCalendarAccessToken());
                events.addAll(calendarEvents);
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
//        GenericEvent savedEvent = eventService.saveEvent(event, event_type, token);
        return ResponseEntity.ok(event);
    }

    @Transactional
    @PutMapping("/update_event/{event_type}/{token}")
    public ResponseEntity<GenericEvent> updateEvent(@RequestBody GenericEvent event, @PathVariable String event_type, @PathVariable String token) {
        GenericEvent updatedEvent = eventService.saveEvent(event, event_type, token);
        return ResponseEntity.ok(updatedEvent);
    }

    @Transactional
    @PutMapping("/complete_event/{token}")
    public ResponseEntity<Boolean> completeEvent(@RequestBody int id) {
        Boolean updatedEvent = eventService.completeEvent(id);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/delete_event/{eventId}/{token}")
    public ResponseEntity<Boolean> deleteEvent(@PathVariable int eventId, @PathVariable String token) {
        boolean update = eventService.deleteEvent(eventId, token);
        return ResponseEntity.ok(update);
    }
}
