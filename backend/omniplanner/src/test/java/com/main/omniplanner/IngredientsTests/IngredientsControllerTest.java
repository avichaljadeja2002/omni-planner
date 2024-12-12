package com.main.omniplanner.IngredientsTests;

import com.main.omniplanner.Ingredients.Ingredients;
import com.main.omniplanner.Ingredients.IngredientsController;
import com.main.omniplanner.Ingredients.IngredientsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class IngredientsControllerTest {
    @Mock
    private IngredientsService ingredientsService;

    @InjectMocks
    private IngredientsController ingredientsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetIngredientsByUserId_Success() {
        int userId = 1;
        Ingredients ingredient1 = new Ingredients();
        ingredient1.setId(10);
        ingredient1.setUserId(userId);
        ingredient1.setIngredientName("Onion");

        Ingredients ingredient2 = new Ingredients();
        ingredient2.setId(20);
        ingredient2.setUserId(userId);
        ingredient2.setIngredientName("Pasta");

        List<Ingredients> events = Arrays.asList(ingredient1, ingredient2);

        when(ingredientsService.getIngredients(userId)).thenReturn(events);
        ResponseEntity<List<Ingredients>> response = ingredientsController.getIngredients(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());

        // Assert for the first event
        assertEquals("Onion", response.getBody().get(0).getIngredientName());
        assertEquals(1, response.getBody().get(0).getUserId());
        assertEquals(10, response.getBody().get(0).getId());

        // Assert for the second event
        assertEquals("Pasta", response.getBody().get(1).getIngredientName());
        assertEquals(1, response.getBody().get(1).getUserId());
        assertEquals(20, response.getBody().get(1).getId());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        int userId = 2;

        when(ingredientsService.getIngredients(userId)).thenReturn(Arrays.asList());
        ResponseEntity<List<Ingredients>> response = ingredientsController.getIngredients(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        int userId = 999;

        when(ingredientsService.getIngredients(userId)).thenReturn(List.of());
        ResponseEntity<List<Ingredients>> response = ingredientsController.getIngredients(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testAddEvent_Success() {
        // Given
        Ingredients ingredient1 = new Ingredients();
        ingredient1.setId(10);
        ingredient1.setUserId(1);
        ingredient1.setIngredientName("Onion");

        // When
        when(ingredientsService.saveEvent(ingredient1)).thenReturn(ingredient1);

        // Act
        ResponseEntity<Ingredients> response = ingredientsController.addEvent(ingredient1);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(10, Objects.requireNonNull(response.getBody()).getId());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getUserId());
        assertEquals("Onion", response.getBody().getIngredientName());
    }
}
