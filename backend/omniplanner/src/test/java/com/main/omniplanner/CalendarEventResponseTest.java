import com.main.omniplanner.calendar.CalendarEvents;
import com.main.omniplanner.responses.CalendarEventResponse;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CalendarEventResponseTest {

    @Test
    public void testConstructorAndGetters() {
        // Create sample CalendarEvents
        CalendarEvents event1 = new CalendarEvents();
        CalendarEvents event2 = new CalendarEvents();
        List<CalendarEvents> events = Arrays.asList(event1, event2);

        // Initialize CalendarEventResponse
        boolean googleCalendarLinked = true;
        CalendarEventResponse response = new CalendarEventResponse(events, googleCalendarLinked);

        // Verify getters
        assertEquals(events, response.getEvents());
        assertTrue(response.isGoogleCalendarLinked());
    }

    @Test
    public void testSetEvents() {
        // Create initial CalendarEventResponse with no events
        CalendarEventResponse response = new CalendarEventResponse(null, false);

        // Create new events list
        CalendarEvents event1 = new CalendarEvents();
        List<CalendarEvents> events = Arrays.asList(event1);

        // Set events
        response.setEvents(events);

        // Verify setEvents
        assertEquals(events, response.getEvents());
    }

    @Test
    public void testSetGoogleCalendarLinked() {
        // Create CalendarEventResponse with googleCalendarLinked initially false
        CalendarEventResponse response = new CalendarEventResponse(null, false);

        // Change googleCalendarLinked value
        response.setGoogleCalendarLinked(true);

        // Verify setGoogleCalendarLinked
        assertTrue(response.isGoogleCalendarLinked());
    }

    @Test
    public void testNullEvents() {
        // Create CalendarEventResponse with null events
        CalendarEventResponse response = new CalendarEventResponse(null, true);

        // Verify that getEvents returns null
        assertNull(response.getEvents());
    }
}