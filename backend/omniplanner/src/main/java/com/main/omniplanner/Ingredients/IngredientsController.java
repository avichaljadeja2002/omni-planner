package com.main.omniplanner.Ingredients;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin
public class IngredientsController {
    @Autowired
    private IngredientsService ingredientsService;

    public IngredientsController(IngredientsService ingredientsService) {
        this.ingredientsService = ingredientsService;
    }

    @GetMapping("/get_ingredients/{userId}")
    public ResponseEntity<List<Ingredients>> getIngredients(@PathVariable int userId) {
        List<Ingredients> events = ingredientsService.getIngredients(userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/add_ingredients")
    public ResponseEntity<Ingredients> addEvent(@RequestBody Ingredients event) {
        Ingredients savedEvent = ingredientsService.saveEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }
}
