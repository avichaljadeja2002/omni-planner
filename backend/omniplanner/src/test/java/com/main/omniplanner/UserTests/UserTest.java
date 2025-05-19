package com.main.omniplanner.UserTests;

import com.main.omniplanner.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.util.AssertionErrors.assertNotNull;

public class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
    }

    @Test
    public void testGetSetId(){
        int id = 123456;
        user.setId(id);  // Set id
        assertEquals(id, user.getId());  // Assert that getId returns the same value
    }

    @Test
    public void testGetSetUsername(){
        String username = "abcdef123456";
        user.setUsername(username);  // Set username
        assertEquals(username, user.getUsername());  // Assert that getUsername returns the same value
    }

    @Test
    public void testGetSetPassword(){
        String password = "abcdef123";
        user.setPassword(password);  // Set password
        assertEquals(password, user.getPassword());  // Assert that getPassword returns the same value
    }

    @Test
    public void testGetSetEnabled(){
        boolean enabled = true;
        user.setEnabled(enabled);  // Set enabled
        assertEquals(enabled, user.isEnabled());  // Assert that isEnabled returns the same value
    }

    @Test
    public void testGetSetGoogleCalendarLinked(){
        boolean googleCalendarLinked = true;
        user.setGoogleCalendarLinked(googleCalendarLinked);  // Set googleCalendarLinked
        assertEquals(googleCalendarLinked, user.isGoogleCalendarLinked());  // Assert that isGoogleCalendarLinked returns the same value
    } 

    @Test
    public void testGoogleCalendarLinkedFalse() {
        user.setGoogleCalendarLinked(false);
        assertEquals(false, user.isGoogleCalendarLinked(), "googleCalendarLinked should be false when set to false");
    }


    @Test
    public void testGetSetGoogleCalendarAccessToken(){
        String googleCalendarAccessToken = "abcdef123456";
        user.setGoogleCalendarAccessToken(googleCalendarAccessToken);  // Set googleCalendarAccessToken
        assertEquals(googleCalendarAccessToken, user.getGoogleCalendarAccessToken());  // Assert that getGoogleCalendarAccessToken returns the same value
    }

    @Test
    public void testGetSetToken(){
        String token = "abcdef";
        user.setToken(token);  // Set token
        assertEquals(token, user.getToken());  // Assert that getToken returns the same value
    }

    @Test
    public void testGetSetName(){
        String name = "abcdef123456";
        user.setName(name);  // Set name
        assertEquals(name, user.getName());  // Assert that getName returns the same value
    }

    @Test
    public void testGetSetPhone(){
        String phone = "abcdef123456";
        user.setPhone(phone);  // Set phone
        assertEquals(phone, user.getPhone());  // Assert that getPhone returns the same value
    }

    @Test
    public void testGetSetAge(){
        String age = "abcdef123456";
        user.setAge(age);  // Set age
        assertEquals(age, user.getAge());  // Assert that getAge returns the same value
    }

    @Test
    public void testGetSetGoogleLogin(){
        boolean googleLogin = true;
        user.setGoogleLogin(googleLogin);  // Set googleLogin
        assertEquals(googleLogin, user.isGoogleLogin());  // Assert that isGoogleLogin returns the same value
    }


    @Test
    public void testGenerateToken() {
        // Arrange
        User user = new User();

        // Act
        String token = user.generateToken();
        user.setToken(token);

        // Assert
        assertNotNull(token, "Generated token should not be null");
        assertEquals(token, user.getToken(), "Token from generateToken and getToken should match");
        assertTrue(token.matches("[0-9a-fA-F-]{36}"), "Token should follow UUID format");
    }

    @Test
    public void testGetSetLastPasswordUpdate(){
        // Arrange
        User user = new User();
        long currentTime = System.currentTimeMillis();
        java.sql.Timestamp timestamp = new java.sql.Timestamp(currentTime);

        // Act
        user.setLastPasswordUpdate(timestamp);

        // Assert
        assertEquals(timestamp, user.getLastPasswordUpdate(), "Last password update should be set correctly");
    }

    @Test
    public void testGetSetPreviousPasswords(){
        // Arrange
        User user = new User();
        java.util.List<String> previousPasswords = new java.util.ArrayList<String>();
        previousPasswords.add("password1");
        previousPasswords.add("password2");

        // Act
        user.setPreviousPasswords(previousPasswords);

        // Assert
        assertEquals(previousPasswords, user.getPreviousPasswords(), "Previous passwords should be set correctly");
    }
    }