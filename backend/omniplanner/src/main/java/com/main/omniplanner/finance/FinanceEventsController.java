package com.main.omniplanner.finance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class FinanceEventsController {

    @Autowired
    private FinanceEventsService financeEventsService;

    public FinanceEventsController(FinanceEventsService financeEventsService) {
        this.financeEventsService = financeEventsService;
    }

    @PostMapping("/add_finance_events")
    public ResponseEntity<FinanceEvents> addEvent(@RequestBody FinanceEvents event) {
        FinanceEvents savedEvent = financeEventsService.saveEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }
    @GetMapping("/get_finance_events/{userId}")
    public ResponseEntity<List<FinanceEvents>> getEventsByUserId(@PathVariable int userId) {
        List<FinanceEvents> events = financeEventsService.getEventsByUserId(userId);
        return ResponseEntity.ok(events);
    }

    @Transactional
    @PutMapping("/update_finance_event")
    public ResponseEntity<FinanceEvents> updateEvent(@RequestBody FinanceEvents event) {
        financeEventsService.updateEvent(event);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }
}
