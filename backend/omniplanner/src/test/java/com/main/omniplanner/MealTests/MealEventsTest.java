package com.main.omniplanner.MealTests;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.meals.MealEvents;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

public class MealEventsTest {

    private MealEvents mealEvents;

    @BeforeEach
    void setUp() {
        mealEvents = new MealEvents();
    }

    @Test
    public void testGetSetId() {
        mealEvents.setId(0);
        assertEquals(0, mealEvents.getId());
    }

    @Test
    public void testGetsetUserId() {
        mealEvents.setUserId(0);
        assertEquals(0, mealEvents.getUserId());
    }

    @Test
    public void testGetSetTitle() {
        mealEvents.setTitle("Team Meeting");
        assertEquals("Team Meeting", mealEvents.getTitle());
    }

    @Test
    public void testGetSetEvent_date() {
        Date date = Date.valueOf("2024-11-05");
        mealEvents.setEvent_date(date);
        assertEquals(date, mealEvents.getEvent_date());
    }

    @Test
    public void testGetSetEvent_time() {
        Time time = Time.valueOf("10:30:00");
        mealEvents.setEvent_time(time);
        assertEquals(time, mealEvents.getEvent_time());
    }

    @Test
    public void testGetSetRepeat_timeline() {
        mealEvents.setRepeat_timeline("Weekly");
        assertEquals("Weekly", mealEvents.getRepeat_timeline());
    }

    @Test
    public void testGetSetRepeating() {
        mealEvents.setRepeating(true);
        assertTrue(mealEvents.isRepeating());
    }

    @Test
    public void testGetSetIngredients() {
        mealEvents.setIngredients("Chicken, Rice, Broccoli");
        assertEquals("Chicken, Rice, Broccoli", mealEvents.getIngredients());
    }
}