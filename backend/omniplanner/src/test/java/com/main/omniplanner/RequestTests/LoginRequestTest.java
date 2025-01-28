package com.main.omniplanner.RequestTests;

import com.main.omniplanner.requests.LoginRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class LoginRequestTest {
    @InjectMocks
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetSetUsername() {
        String username = "abcdef123456";

        loginRequest.setUsername(username);  // Set username
        assertEquals(username, loginRequest.getUsername());  // Assert that getUsername returns the same value
    }
    @Test
    public void testGetSetPassword() {
        String password = "abcdef123456";

        loginRequest.setPassword(password);  // Set password
        assertEquals(password, loginRequest.getPassword());  // Assert that getPassword returns the same value
    }
}

