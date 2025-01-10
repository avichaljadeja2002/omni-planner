package com.main.omniplanner.UserTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import com.main.omniplanner.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Arrays;
import java.util.List;

public class UserServiceTest {

    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); 
        userService = new UserService(userRepository);
        user = new User();
        user.setId(0);
        user.setName("John Doe");
        user.setEmail("johndoe@example.com");
        user.setGoogle_calendar_linked(true);
        user.setGoogle_calendar_access_token("access_token_123");
        user.setPassword("password123");
    }

    @Test
    public void testGetSaveEvent() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));

        List<User> userList = userService.getAllUsers();

        assertEquals(1, userList.size());
        User testUser = userList.get(0);
        assertEquals(0, testUser.getId());
        assertEquals("John Doe", testUser.getName());
        assertEquals("johndoe@example.com", testUser.getEmail());
        assertTrue(testUser.isGoogle_calendar_linked());
        assertEquals("access_token_123", testUser.getGoogle_calendar_access_token());
    }

    @Test
    public void testLoginSuccess() {
        when(userRepository.findByUserName("johndoe")).thenReturn(Arrays.asList(user));

        String result = userService.login("johndoe", "password123");

        assertNotNull(result);
        assertTrue(result.contains("0"));
    }

    @Test
    public void testLoginFailure() {
        when(userRepository.findByUserName("johndoe")).thenReturn(Arrays.asList(user));

        String result = userService.login("johndoe", "wrongpassword");

        assertNull(result);
    }

    @Test
    public void testUserNotFound() {
        when(userRepository.findByUserName("nonexistent")).thenReturn(Arrays.asList());

        String result = userService.login("nonexistent", "password123");

        assertNull(result);
    }
}
