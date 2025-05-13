package com.main.omniplanner.user;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserCalendarInfoTest {

    @Test
    void testDefaultConstructorAndSetters() {
        UserCalendarInfo info = new UserCalendarInfo();
        info.setId(42);
        info.setGoogleCalendarLinked(true);
        info.setGoogleCalendarAccessToken("token123");

        assertEquals(42, info.getId(), "ID should be set correctly");
        assertTrue(info.isGoogleCalendarLinked(), "Google Calendar should be linked");
        assertEquals("token123", info.getGoogleCalendarAccessToken(), "Access token should match");
    }

    @Test
    void testParameterizedConstructor() {
        UserCalendarInfo info = new UserCalendarInfo(7, false, "abcToken");

        assertEquals(7, info.getId(), "ID should be set from constructor");
        assertFalse(info.isGoogleCalendarLinked(), "Google Calendar should not be linked");
        assertEquals("abcToken", info.getGoogleCalendarAccessToken(), "Access token should match constructor value");
    }

    @Test
    void testToStringWithTokenPresent() {
        UserCalendarInfo info = new UserCalendarInfo(1, true, "secret");
        String result = info.toString();

        assertTrue(result.contains("id=1"), "toString should include correct id");
        assertTrue(result.contains("isGoogleCalendarLinked=true"), "toString should include correct link status");
        assertTrue(result.contains("googleCalendarAccessToken='[present]'"), "toString should mask token");
    }

    @Test
    void testToStringWithTokenNull() {
        UserCalendarInfo info = new UserCalendarInfo(2, false, null);
        String result = info.toString();

        assertTrue(result.contains("id=2"), "toString should include correct id");
        assertTrue(result.contains("isGoogleCalendarLinked=false"), "toString should include correct link status");
        assertTrue(result.contains("googleCalendarAccessToken='[null]'"), "toString should indicate null token");
    }
}
