package com.main.omniplanner.meals;

import com.main.omniplanner.Ingredients.Ingredients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class MealEventsController {

    @Autowired
    private MealEventsService mealEventsService;

    public MealEventsController(MealEventsService mealEventsService) {
        this.mealEventsService = mealEventsService;
    }

    @PostMapping("/add_meal_events")
    public ResponseEntity<MealEvents> addEvent(@RequestBody MealEvents event) {
        MealEvents savedEvent = mealEventsService.saveEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }
    @GetMapping("/get_meal_events/{userId}")
    public ResponseEntity<List<MealEvents>> getEventsByUserId(@PathVariable int userId) {
        List<MealEvents> events = mealEventsService.getEventsByUserId(userId);
        return ResponseEntity.ok(events);
    }

}
