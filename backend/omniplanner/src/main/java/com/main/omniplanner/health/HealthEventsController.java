package com.main.omniplanner.health;

import com.main.omniplanner.finance.FinanceEvents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class HealthEventsController {

    @Autowired
    private HealthEventsService healthEventsService;

    public HealthEventsController(HealthEventsService healthEventsService) {
        this.healthEventsService = healthEventsService;
    }

    @PostMapping("/add_health_events")
    public ResponseEntity<HealthEvents> addEvent(@RequestBody HealthEvents event) {
        HealthEvents savedEvent = healthEventsService.saveEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }
    @GetMapping("/get_health_events/{userId}")
    public ResponseEntity<List<HealthEvents>> getEventsByUserId(@PathVariable int userId) {
        List<HealthEvents> events = healthEventsService.getEventsByUserId(userId);
        return ResponseEntity.ok(events);
    }

    @Transactional
    @PutMapping("/update_health_event")
    public ResponseEntity<HealthEvents> updateEvent(@RequestBody HealthEvents event) {
        healthEventsService.updateEvent(event);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }
}
