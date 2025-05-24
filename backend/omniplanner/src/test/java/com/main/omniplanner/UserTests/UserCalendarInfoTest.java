package com.main.omniplanner.UserTests;

import com.main.omniplanner.user.UserCalendarInfo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.util.AssertionErrors.assertNotNull;

public class UserCalendarInfoTest {
    private UserCalendarInfo userCalendarInfo;

    @BeforeEach
    void setUp() {
        userCalendarInfo = new UserCalendarInfo();
    }

    @Test
    public void testGetSetGoogleCalendarLinked(){
        boolean googleCalendarLinked = true;
        userCalendarInfo.setGoogleCalendarLinked(googleCalendarLinked);  // Set googleCalendarLinked
        assertEquals(googleCalendarLinked, userCalendarInfo.isGoogleCalendarLinked());  // Assert that isGoogleCalendarLinked returns the same value
    }

    @Test
    public void testGetSetImapLinked(){
        boolean imapLinked = true;
        userCalendarInfo.setImapLinked(imapLinked);  // Set imapLinked
        assertEquals(imapLinked, userCalendarInfo.isImapLinked());  // Assert that isImapLinked returns the same value
    }
}