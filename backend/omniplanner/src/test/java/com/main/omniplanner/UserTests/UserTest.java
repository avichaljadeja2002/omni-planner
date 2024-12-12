package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserTest {

    private User user;

    @BeforeEach
    public void setUp() {
        user = new User();
    }

    @Test
    public void testGetSetId() {
        user.setId(1);
        assertEquals(1, user.getId());
    }

    @Test
    public void testGetSetName() {
        user.setName("John Doe");
        assertEquals("John Doe", user.getName());
    }

    @Test
    public void testGetSetEmail() {
        user.setEmail("johndoe@example.com");
        assertEquals("johndoe@example.com", user.getEmail());
    }

    @Test
    public void testIsSetGoogleCalendarLinked() {
        user.setGoogle_calendar_linked(true);
        assertTrue(user.isGoogle_calendar_linked());

        user.setGoogle_calendar_linked(false);
        assertFalse(user.isGoogle_calendar_linked());
    }

    @Test
    public void testGetSetGoogleCalendarAccessToken() {
        String token = "access_token_123";
        user.setGoogle_calendar_access_token(token);
        assertEquals(token, user.getGoogle_calendar_access_token());
    }
}
