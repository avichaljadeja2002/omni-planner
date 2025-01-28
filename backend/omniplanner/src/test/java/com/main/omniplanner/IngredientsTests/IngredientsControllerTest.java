package com.main.omniplanner.IngredientsTests;

import com.main.omniplanner.Ingredients.Ingredients;
import com.main.omniplanner.Ingredients.IngredientsController;
import com.main.omniplanner.Ingredients.IngredientsService;
import com.main.omniplanner.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class IngredientsControllerTest {
    @Mock
    private IngredientsService ingredientsService;

    @Autowired
    private UserRepository userRepository;

    private IngredientsController ingredientsController;
    Ingredients ingredient1;
    Ingredients ingredient2;
    private String token;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userRepository = mock(UserRepository.class);
        ingredientsService = mock(IngredientsService.class);
        ingredientsController = new IngredientsController(ingredientsService, userRepository);
        token = "1a2b3c4d";
        ingredient1 = new Ingredients();
        ingredient1.setId(10);
        ingredient1.setUserId(1);
        ingredient1.setIngredientName("Onion");

        ingredient2 = new Ingredients();
        ingredient2.setId(20);
        ingredient2.setUserId(1);
        ingredient2.setIngredientName("Pasta");
    }

    @Test
    void testGetIngredientsByUserId_Success() {
        List<Ingredients> events = Arrays.asList(ingredient1, ingredient2);
        when(userRepository.getIdByToken(token)).thenReturn(2);
        when(ingredientsService.getIngredients(2)).thenReturn(events);
        ResponseEntity<List<Ingredients>> response = ingredientsController.getIngredients(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
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
        when(ingredientsService.getIngredients(2)).thenReturn(Arrays.asList());
        when(userRepository.getIdByToken(token)).thenReturn(2);
        ResponseEntity<List<Ingredients>> response = ingredientsController.getIngredients(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        when(ingredientsService.getIngredients(999)).thenReturn(List.of());
        when(userRepository.getIdByToken(token)).thenReturn(999);
        ResponseEntity<List<Ingredients>> response = ingredientsController.getIngredients(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testAddEvent_Success() {
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
