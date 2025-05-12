package com.main.omniplanner.EventTests;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.user.GenericEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class GenericEventTest {

    private GenericEvent event;

    @BeforeEach
    void setUp() {
        event = new GenericEvent();
    }

    @Test
    public void testGetSetDescription() {
        event.setDescription("Meeting");
        assertEquals("Meeting", event.getDescription());
    }

    @Test
    public void testGetSetEventDate() {
        event.setEvent_date("2024-11-05");
        assertEquals("2024-11-05", event.getEvent_date());
    }

    @Test
    public void testGetSetEventTime() {
        event.setEvent_time("10:30:00");
        assertEquals("10:30:00", event.getEvent_time());
    }

    @Test
    public void testGetSetMoney() {
        event.setMoney(100.5f);
        assertEquals(100.5f, event.getMoney());
    }

    @Test
    public void testGetSetRepeating() {
        event.setRepeating(true);
        assertTrue(event.getRepeating());
    }

    @Test
    public void testGetSetRepeatingTimeline() {
        event.setRepeat_timeline(2);
        assertEquals(2, event.getRepeat_timeline());
    }

    @Test
    public void testGetSetID() {
        event.setId(1);
        assertEquals(1, event.getId());
    }

    @Test
    public void testGetSetTitle() {
        event.setTitle("Team Meeting");
        assertEquals("Team Meeting", event.getTitle());
    }

    @Test
    public void testGetSetUserId() {
        event.setUserId(101);
        assertEquals(101, event.getUserId());
    }

    @Test
    public void testGetSetEventType() {
        event.setEvent_type("Work");
        assertEquals("Work", event.getEvent_type());
    }

    @Test
    public void testGetSetCompletedTrue() {
        event.setCompleted(true);
        assertTrue(event.isCompleted(), "Completed should be true when set to true");
    }

    @Test
    public void testGetSetCompletedFalse() {
        event.setCompleted(false);
        assertFalse(event.isCompleted(), "Completed should be false when set to false");
    }


    @Test
    public void testGetSetIngredients(){
        event.setIngredients("3,4");
        assertEquals("3,4", event.getIngredients());
    }

}
