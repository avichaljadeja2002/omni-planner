package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.meals.MealEvents;
import com.main.omniplanner.meals.MealEventsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class MealEventsServiceTest {

    private MealEventsService mealEventsService;
    private MealEvents mealEvents;

    @BeforeEach
    void setUp() {
        mealEventsService = new MealEventsService();
    }

    @Test
    public void testGetSaveEvent() {
        mealEvents.setId(0);
        mealEvents.setUser_id(0);
        mealEvents.setTitle("Team Meeting");
        Date date = Date.valueOf("2024-11-05");
        mealEvents.setEvent_date(date);
        Time time = Time.valueOf("10:30:00");
        mealEvents.setEvent_time(time);
        mealEventsService.saveEvent(mealEvents);
        List<MealEvents> mealEventsList = mealEventsService.getEventsByUserId(0);
        MealEvents testMealEvents = mealEventsList.get(0);
        assertEquals(0, testMealEvents.getId());
        assertEquals(0, testMealEvents.getUser_id());
        assertEquals("Team Meeting", testMealEvents.getTitle());
        assertEquals(date, testMealEvents.getEvent_date());
        assertEquals(time, testMealEvents.getEvent_time());
    }
}
