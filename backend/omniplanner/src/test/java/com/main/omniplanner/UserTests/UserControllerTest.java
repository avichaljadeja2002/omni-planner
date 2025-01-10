package com.main.omniplanner.UserTests;

import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserController;
import com.main.omniplanner.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.sql.Time;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Mock
    private UserService userService;

    private UserController userController;

    User user1;
    User user2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userController = new UserController(userService);

        user1 = new User();
        user1.setId(1);
        user1.setName("John Doe");
        user1.setEmail("johndoe@example.com");
        user1.setGoogle_calendar_linked(true);
        user1.setGoogle_calendar_access_token("access_token_123");

        user2 = new User();
        user2.setId(2);
        user2.setName("John Doe");
        user2.setEmail("johndoe@example.com");
        user2.setGoogle_calendar_linked(false);
    }

    @Test
    void testGetUsersByUserId_Success() {
        List<User> users = Arrays.asList(user1, user2);

        when(userService.getAllUsers()).thenReturn(users);
        ResponseEntity<List<User>> response = ResponseEntity.ok(userController.getUsers());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, Objects.requireNonNull(response.getBody()).size());

        // Assert for the first event
        assertEquals(1, response.getBody().get(0).getId());
        assertEquals("John Doe", response.getBody().get(0).getName());
        assertEquals("johndoe@example.com", response.getBody().get(0).getEmail());
        assertEquals(true, response.getBody().get(0).isGoogle_calendar_linked());
        assertEquals("access_token_123", response.getBody().get(0).getGoogle_calendar_access_token());
       
        // Assert for the second event
        assertEquals(2, response.getBody().get(1).getId());
        assertEquals("John Doe", response.getBody().get(1).getName());
        assertEquals("johndoe@example.com", response.getBody().get(1).getEmail());
        assertEquals(false, response.getBody().get(1).isGoogle_calendar_linked());
    }

    @Test
    void testGetUsersByUserId_EmptyList() {
        when(userService.getAllUsers()).thenReturn(Arrays.asList());
        ResponseEntity<List<User>> response = ResponseEntity.ok(userController.getUsers());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetUsersByUserId_NonExistingUser() {
        when(userService.getAllUsers()).thenReturn(List.of());
        ResponseEntity<List<User>> response = ResponseEntity.ok(userController.getUsers());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testAddUser_Success() {
        // When
        when(userService.getAllUsers()).thenReturn(List.of(user1));

        // Act
        ResponseEntity<List<User>> response = ResponseEntity.ok(userController.getUsers());

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).get(0).getId());
        assertEquals("John Doe", response.getBody().get(0).getName());
        assertEquals("johndoe@example.com", response.getBody().get(0).getEmail());
        assertTrue(response.getBody().get(0).isGoogle_calendar_linked());
        assertEquals("access_token_123", response.getBody().get(0).getGoogle_calendar_access_token());
    }

    @Test
    void testLogin_Success() {
        when(userService.login("jdoe", "password123")).thenReturn("1,jdoe,johndoe@gmail.com,John Doe");
        String loginRequest = "{\"userName\":\"jdoe\",\"password\":\"password123\"}";
        assertEquals(userController.login(loginRequest), "1,jdoe,johndoe@gmail.com,John Doe");
    }

    @Test
    void testLogin_Fail() {
        when(userService.login("jdoe", "password123")).thenReturn(null);
        String loginRequest = "\"userName\":\"jdoe\",\"password\":\"password123\"}";
        assertNull(userController.login(loginRequest));
    }
    }
