package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class UserServiceTest {

    private UserService UserService;
    private User user;

    @BeforeEach
    void setUp() {
        userService = new userService();
    }

    @Test
    public void testGetSaveEvent() {
        user.setId(0);
        user.setName("John Doe");
        user.setEmail("johndoe@example.com");
        user.setGoogle_calendar_linked(true);
        user.setGoogle_calendar_access_token("access_token_123");

        List<User> userList = userService.getAllUsers();
        User testUser = userList.get(0);
        assertEquals(0, user.getId());
        assertEquals("John Doe", user.getName());
        assertEquals("johndoe@example.com", user.getEmail());
        assertEquals(true, user.isGoogle_calendar_linked());
        assertEquals("access_token_123", user.isGoogle_calendar_linked());
    }
}
