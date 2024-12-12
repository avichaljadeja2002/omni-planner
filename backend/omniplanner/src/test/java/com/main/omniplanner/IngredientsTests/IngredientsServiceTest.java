package com.main.omniplanner.IngredientsTests;

import com.main.omniplanner.Ingredients.Ingredients;
import com.main.omniplanner.Ingredients.IngredientsRepository;
import com.main.omniplanner.Ingredients.IngredientsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class IngredientsServiceTest {

    private IngredientsService ingredientsService;
    private Ingredients ingredients;

    @Mock
    private IngredientsRepository ingredientsRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ingredientsService = new IngredientsService(ingredientsRepository);
        ingredients = new Ingredients();
        ingredients.setId(0);
        ingredients.setUserId(0);
        ingredients.setIngredientName("Onion");
    }

    @Test
    public void testGetSaveEvent() {
        when(ingredientsRepository.save(ingredients)).thenReturn(ingredients);
        when(ingredientsRepository.findIngredientsByUserId(eq(0)))
                .thenReturn(Collections.singletonList(ingredients));

        ingredientsService.saveEvent(ingredients);
        List<Ingredients> ingredientsList = ingredientsService.getIngredients(0);
        assertFalse(ingredientsList.isEmpty(), "The list should not be empty");
        Ingredients testIngredient = ingredientsList.get(0);
        assertEquals(0, testIngredient.getId());
        assertEquals(0, testIngredient.getUserId());
        assertEquals("Onion", testIngredient.getIngredientName());

        verify(ingredientsRepository).save(ingredients);
        verify(ingredientsRepository).findIngredientsByUserId(eq(0));
    }
}
