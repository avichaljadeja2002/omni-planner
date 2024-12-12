package com.main.omniplanner.Ingredients;

import com.main.omniplanner.health.HealthEventsRepository;
import com.main.omniplanner.meals.MealEvents;
import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientsService {
    @Autowired
    IngredientsRepository ingredientsRepository;

    public IngredientsService(IngredientsRepository ingredientsRepository) {
        this.ingredientsRepository = ingredientsRepository;
    }

    public List<Ingredients> getIngredients(int userId) {
        return ingredientsRepository.findIngrediantsByUserId(userId);
    }

    public Ingredients saveEvent(Ingredients ingredients) {
        return ingredientsRepository.save(ingredients);
    }

}
