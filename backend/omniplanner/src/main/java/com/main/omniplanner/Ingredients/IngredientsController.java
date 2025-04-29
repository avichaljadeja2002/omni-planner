package com.main.omniplanner.Ingredients;

import com.main.omniplanner.user.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    public IngredientsController(IngredientsService ingredientsService, UserRepository userRepository) {
        this.ingredientsService = ingredientsService;
        this.userRepository = userRepository;
    }

    @GetMapping("/get_ingredients/{token}")
    public ResponseEntity<List<Ingredients>> getIngredients(@PathVariable String token) {
        Integer userId = userRepository.getIdByToken(token);
        List<Ingredients> events = ingredientsService.getIngredients(userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/add_ingredients")
    public ResponseEntity<Ingredients> addIngrediant(@RequestBody Ingredients event) {
        Ingredients savedEvent = ingredientsService.saveEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }
}
