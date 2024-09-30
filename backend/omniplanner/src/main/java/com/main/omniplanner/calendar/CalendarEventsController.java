package com.main.omniplanner.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class CalendarEventsController {

    @Autowired
    private CalendarEventsService calendarEventsService;

    @PostMapping("/add_calendar_events")
    public ResponseEntity<CalendarEvents> addEvent(@RequestBody CalendarEvents event) {
        CalendarEvents savedEvent = calendarEventsService.saveEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }
    @GetMapping("/get_calendar_events/{userId}")
    public ResponseEntity<List<CalendarEvents>> getEventsByUserId(@PathVariable int userId) {
        List<CalendarEvents> events = calendarEventsService.getEventsByUserId(userId);
        return ResponseEntity.ok(events);
    }
}
