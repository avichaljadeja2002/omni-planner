package com.main.omniplanner.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class EventController {
    @Autowired
    private EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }
    @GetMapping("/get_all_events/{userId}")
    public ResponseEntity<List<GenericEvent>> getEventsByUserId(@PathVariable int userId) {
        List<GenericEvent> events = eventService.getEventsByUserId(userId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/get_events/{event_type}/{userId}")
    public ResponseEntity<List<GenericEvent>> getEventsByType(@PathVariable int userId, @PathVariable String event_type) {
        List<GenericEvent> events = eventService.getEventsByType(event_type, userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/add_event/{event_type}")
    public ResponseEntity<GenericEvent> addEvent(@RequestBody GenericEvent event, @PathVariable String event_type) {
        GenericEvent savedEvent = eventService.saveEvent(event, event_type);
        return ResponseEntity.ok(savedEvent);
    }

    @Transactional
    @PutMapping("/update_event/{event_type}")
    public ResponseEntity<GenericEvent> updateEvent(@RequestBody GenericEvent event, @PathVariable String event_type) {
        GenericEvent updatedEvent = eventService.saveEvent(event, event_type);
        return ResponseEntity.ok(updatedEvent);
    }
}
