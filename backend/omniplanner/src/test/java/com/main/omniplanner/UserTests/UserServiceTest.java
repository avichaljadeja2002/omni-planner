package com.main.omniplanner.UserTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.user.PasswordService;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import com.main.omniplanner.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordService passwordService;

    private User user;

    private String secretKey = "BOAMtX5X45B891q0WTAkICBj5kCRIrwMjF+kOzQ381cdb6wft7WCuxDcpOQsEe/1CA/gG+iUH/9d48kqt6hS9g==";
    private Long jwtExpiration = 86400000L; // 1 day in milliseconds

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository, passwordService);

        userService.SECRET_KEY = secretKey;
        userService.JWT_EXPIRATION = jwtExpiration;

        user = new User();
        user.setId(0);
        user.setName("John Doe");
        user.setEmail("johndoe@example.com");
        user.setGoogle_calendar_linked(true);
        user.setGoogle_calendar_access_token("access_token_123");
        user.setPasswordHash("passwordhash123");
        user.setSalt("salt123");
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
        when(userRepository.findByEmail("johndoe@example.com")).thenReturn(Arrays.asList(user));
        when(passwordService.verifyPassword("password123", user.getSalt(), user.getPasswordHash())).thenReturn(true);

        String result = userService.login("johndoe@example.com", "password123");

        assertNotNull(result);
        assertTrue(result.contains("0"));
    }

    @Test
    public void testLoginFailure() {
        when(userRepository.findByEmail("johndoe@example.com")).thenReturn(Arrays.asList(user));
        when(passwordService.verifyPassword("wrongpassword", user.getSalt(), user.getPasswordHash())).thenReturn(false);

        String result = userService.login("johndoe@example.com", "wrongpassword");

        assertNull(result);
    }

    @Test
    public void testNewUserCreated() {
        when(userRepository.findByEmail("nonexistent")).thenReturn(Arrays.asList());
        when(passwordService.generateSalt()).thenReturn("salt123");
        when(passwordService.hashPassword("password123", "salt123")).thenReturn("hashedPassword123");

        String result = userService.login("nonexistent", "password123");

        verify(userRepository).save(any(User.class));
        assertNotNull(result); // Ensure that result is not null


    }

    @Test
    public void checkLoginSuccess() {
        when(userRepository.findByEmail("johndoe@example.com")).thenReturn(Arrays.asList(user));
        String token = userService.generateToken(user);
        user.setTempToken(token);
        when(userRepository.save(user)).thenReturn(user);

        String result = userService.checkLogin("johndoe@example.com", token);

        assertNotNull(result);
        assertTrue(result.contains("0"));
    }

    @Test
    public void checkLoginFailure() {
        when(userRepository.findByEmail("johndoe@example.com")).thenReturn(Arrays.asList(user));

        String validToken = userService.generateToken(user);
        user.setTempToken(validToken);

        String result = userService.checkLogin("johndoe@example.com", "invalidToken");

        assertNull(result);
    }

    @Test
    public void checkLoginEmpty() {
        String result = userService.checkLogin("nonexistent", "invalidToken");

        assertNull(result);
    }

    @Test
    public void checkLoginWithUserIdSuccess() {
        when(userRepository.findByEmail("johndoe@example.com")).thenReturn(Arrays.asList(user));
        String token = userService.generateToken(user);
        user.setTempToken(token);
        String expectedUserId = String.valueOf(user.getId());

        String result = userService.checkLogin("johndoe@example.com", token, expectedUserId);

        assertNotNull(result);
        assertTrue(result.contains(expectedUserId)); // Ensure it contains the correct ID
    }

    @Test
    public void checkLoginWithUserIdFailure() {
        when(userRepository.findByEmail("johndoe@example.com")).thenReturn(Arrays.asList(user));
        String token = userService.generateToken(user);
        user.setTempToken(token);

        // Use a different ID to simulate failure
        String wrongUserId = "999";
        String result = userService.checkLogin("johndoe@example.com", token, wrongUserId);

        assertNull(result); // Should return null since IDs do not match
    }

    @Test
    public void checkLoginWithUserIdEmpty() {
        String result = userService.checkLogin("nonexistent", "invalidToken", "1");

        assertNull(result);
    }
}
