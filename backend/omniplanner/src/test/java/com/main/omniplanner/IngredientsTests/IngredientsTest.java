package com.main.omniplanner.IngredientsTests;

import com.main.omniplanner.Ingredients.Ingredients;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class IngredientsTest {
    private Ingredients ingredients;

    @BeforeEach
    void setUp() {
        ingredients = new Ingredients();
    }

    @Test
    public void testGetSetId() {
        ingredients.setId(0);
        assertEquals(0, ingredients.getId());
    }

    @Test
    public void testGetSetUser_id() {
        ingredients.setUserId(0);
        assertEquals(0, ingredients.getUserId());
    }

    @Test
    public void testGetSetIngredientName() {
        ingredients.setIngredientName("Onion");
        assertEquals("Onion", ingredients.getIngredientName());
    }
}
