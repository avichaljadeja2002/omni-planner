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

    @Autowired
    private UserRepository userRepository;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }
    @GetMapping("/get_all_events/{token}")
    public ResponseEntity<List<GenericEvent>> getEventsByUserId(@PathVariable String token) {
        Integer userId = userRepository.getIdByToken(token);
        List<GenericEvent> events = eventService.getEventsByUserId(userId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/get_events/{event_type}/{token}")
    public ResponseEntity<List<GenericEvent>> getEventsByType(@PathVariable String token, @PathVariable String event_type) {
        Integer userId = userRepository.getIdByToken(token);
        List<GenericEvent> events = eventService.getEventsByType(event_type, userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/add_event/{event_type}/{token}")
    public ResponseEntity<GenericEvent> addEvent(@RequestBody GenericEvent event, @PathVariable String event_type, @PathVariable String token) {
        GenericEvent savedEvent = eventService.saveEvent(event, event_type, token);
        return ResponseEntity.ok(savedEvent);
    }

    @Transactional
    @PutMapping("/update_event/{event_type}/{token}")
    public ResponseEntity<GenericEvent> updateEvent(@RequestBody GenericEvent event, @PathVariable String event_type, @PathVariable String token) {
        GenericEvent updatedEvent = eventService.saveEvent(event, event_type, token);
        return ResponseEntity.ok(updatedEvent);
    }
}
