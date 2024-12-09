package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.meals.MealEvents;
import com.main.omniplanner.meals.MealEventsRepository;
import com.main.omniplanner.meals.MealEventsService;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

public class MealEventsServiceTest {

    private MealEventsService mealEventsService;
    private MealEvents mealEvents;

    @Mock
    private MealEventsRepository mealEventsRepository;

    @Mock
    private EventService eventService;

    private Date date;
    private Time time;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mealEventsService = new MealEventsService(mealEventsRepository, eventService);
        mealEvents = new MealEvents();
        mealEvents.setId(0);
        mealEvents.setUser_id(0);
        mealEvents.setTitle("Team Meeting");
        date = Date.valueOf("2024-11-05");
        mealEvents.setEvent_date(date);
        time = Time.valueOf("10:30:00");
        mealEvents.setEvent_time(time);
    }

    @Test
    public void testGetSaveEvent() {
        when(mealEventsRepository.save(mealEvents)).thenReturn(mealEvents);
        when(mealEventsRepository.findUpcomingByUserId(eq(0), anyLong()))
                .thenReturn(Collections.singletonList(mealEvents));

        mealEventsService.saveEvent(mealEvents);
        List<MealEvents> mealEventsList = mealEventsService.getEventsByUserId(0);

        assertFalse(mealEventsList.isEmpty(), "The list should not be empty");
        MealEvents testMealEvents = mealEventsList.get(0);
        assertEquals(0, testMealEvents.getId());
        assertEquals(0, testMealEvents.getUser_id());
        assertEquals("Team Meeting", testMealEvents.getTitle());
        assertEquals(date, testMealEvents.getEvent_date());
        assertEquals(time, testMealEvents.getEvent_time());

        verify(mealEventsRepository).save(mealEvents);
        verify(mealEventsRepository).findUpcomingByUserId(eq(0), anyLong());
    }
}
