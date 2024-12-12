package com.main.omniplanner.Ingredients;

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
        return ingredientsRepository.findIngredientsByUserId(userId);
    }

    public Ingredients saveEvent(Ingredients ingredients) {
        return ingredientsRepository.save(ingredients);
    }

}
