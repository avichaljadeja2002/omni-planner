package com.main.omniplanner.EventTests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.main.omniplanner.EventTests.*;
import com.main.omniplanner.user.*;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailCalendarEventTest {
    @Mock
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;

    private EventController eventController;

    private GmailCalendarEvent event1;
    private ImapCalendarEvent event2;
    String token;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userRepository = mock(UserRepository.class);
        eventService = mock(EventService.class);
        eventController = new EventController(eventService, userRepository);
        token = "1a2b3c4d";

        event1 = new GmailCalendarEvent();
        event1.setDescription("Meeting 1");
        event1.setEvent_date("2023-10-01");
        event1.setEvent_time("10:00:00");
        event1.setRepeating(false);
        event1.setId(1);
        event1.setTitle("Event 1");
        event1.setUserId(1);
        event1.setEvent_type("Calendar");

        event2 = new ImapCalendarEvent();
        event2.setDescription("Meeting 2");
        event2.setEvent_date("2023-10-02");
        event2.setEvent_time("11:00:00");
        event2.setMoney(2.1f);
        event2.setRepeating(true);
        event2.setRepeat_timeline(2);
        event2.setId(2);
        event2.setTitle("Event 2");
        event2.setUserId(1);
        event2.setEvent_type("Calendar");
    }

    @Test
    void testGetEmailEventNames() {
        assertEquals("Google: Event 1", event1.getLabel());
        assertEquals("Google", event1.getEmail_type());
        assertEquals("Meeting 1", event1.getDescription());
        assertEquals("2023-10-01", event1.getEvent_date());
        assertEquals("10:00:00", event1.getEvent_time());
        assertEquals(false, event1.getRepeating());
        assertEquals(1, event1.getId());
        assertEquals("Event 1", event1.getTitle());
        assertEquals(1, event1.getUserId());
        assertEquals("Calendar", event1.getEvent_type());

        assertEquals("Imap: Event 2", event2.getLabel());
        assertEquals("Imap", event2.getEmail_type());
        assertEquals("Meeting 2", event2.getDescription());
        assertEquals("2023-10-02", event2.getEvent_date());
        assertEquals("11:00:00", event2.getEvent_time());
        assertEquals(true, event2.getRepeating());
        assertEquals(2, event2.getRepeat_timeline());
        assertEquals(2, event2.getId());
        assertEquals("Event 2", event2.getTitle());
        assertEquals(1, event2.getUserId());
        assertEquals("Calendar", event2.getEvent_type());
    }
}