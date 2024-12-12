package com.main.omniplanner.EventTests;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.user.Event;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

public class EventTest {

    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
    }

    @Test
    public void testGetSetDescription() {
        event.setDescription("Meeting");
        assertEquals("Meeting", event.getDescription());
    }

    @Test
    public void testGetSetEventDate() {
        Date date = Date.valueOf("2024-11-05");
        event.setEventDate(date);
        assertEquals(date, event.getEventDate());
    }

    @Test
    public void testGetSetEventTime() {
        Time time = Time.valueOf("10:30:00");
        event.setEventTime(time);
        assertEquals(time, event.getEventTime());
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
        event.setRepeatTimeline("weekly");
        assertEquals("weekly", event.getRepeatTimeline());
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
    public void testGetSetIngredients(){
        event.setIngredients("3,4");
        assertEquals("3,4", event.getIngredients());
    }

}
