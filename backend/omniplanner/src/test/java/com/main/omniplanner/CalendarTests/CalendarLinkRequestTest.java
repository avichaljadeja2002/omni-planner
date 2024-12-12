package com.main.omniplanner;

import com.main.omniplanner.requests.CalendarLinkRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;

public class CalendarLinkRequestTest {
    @InjectMocks
    private CalendarLinkRequest calendarLinkRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetSetUserId() {
        Integer userId = 123;

        calendarLinkRequest.setUserId(userId);  // Set userId
        assertEquals(userId, calendarLinkRequest.getUserId());  // Assert that getUserId returns the same value
    }

    @Test
    public void testGetSetAccessToken() {
        String accessToken = "abcdef123456";

        calendarLinkRequest.setAccessToken(accessToken);  // Set accessToken
        assertEquals(accessToken, calendarLinkRequest.getAccessToken());  // Assert that getAccessToken returns the same value
    }

    @Test
    public void testNullUserId() {
        calendarLinkRequest.setUserId(null);  // Set userId to null
        assertNull(calendarLinkRequest.getUserId());  // Assert that getUserId returns null
    }

    @Test
    public void testNullAccessToken() {
        calendarLinkRequest.setAccessToken(null);  // Set accessToken to null
        assertNull(calendarLinkRequest.getAccessToken());  // Assert that getAccessToken returns null
    }
}

