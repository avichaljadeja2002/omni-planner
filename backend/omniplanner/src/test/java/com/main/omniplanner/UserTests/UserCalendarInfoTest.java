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

    @Test
    public void testGetSetGoogleCalendarAccessToken(){
        String googleCalendarAccessToken = "abcdef123456";
        userCalendarInfo.setGoogleCalendarAccessToken(googleCalendarAccessToken);  // Set googleCalendarAccessToken
        assertEquals(googleCalendarAccessToken, userCalendarInfo.getGoogleCalendarAccessToken());  // Assert that googleCalendarAccessToken returns the same value
    }

    @Test
    public void testGetSetImapAccessToken(){
        String imapAccessToken = "abcdef123456";
        userCalendarInfo.setImapAccessToken(imapAccessToken);  // Set imapAccessToken
        assertEquals(imapAccessToken, userCalendarInfo.getImapAccessToken());  // Assert that imapAccessToken returns the same value
    }

    @Test
    public void testToString(){
        int id = 123456;
        userCalendarInfo.setId(id);  // Set id
        boolean googleCalendarLinked = true;
        userCalendarInfo.setGoogleCalendarLinked(googleCalendarLinked);  // Set googleCalendarLinked
        String googleCalendarAccessToken = "abcdef123456";
        userCalendarInfo.setGoogleCalendarAccessToken(googleCalendarAccessToken);  // Set userCalendarInfo
        assertEquals("UserCalendarInfo{" + "id=" + id + ", isGoogleCalendarLinked=" + googleCalendarLinked +	
        ", googleCalendarAccessToken='" + (googleCalendarAccessToken != null ? "[present]" : "[null]") + '\'' +  
        '}', userCalendarInfo.toString());  // Assert that toString returns the correct value
    }
}