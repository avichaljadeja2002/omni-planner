package com.main.omniplanner.meals;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventRepository;
import com.main.omniplanner.user.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MealEventsService {

    @Autowired
    private MealEventsRepository mealEventsRepository;

    @Autowired
    private EventService eventService;

    // Constructor injection
    public MealEventsService(MealEventsRepository mealEventsRepository, EventService eventService) {
        this.mealEventsRepository = mealEventsRepository;
        this.eventService = eventService;
    }

    public MealEvents saveEvent(MealEvents event) {
        Event event1 = new Event();
        event1.setEventDate(event.getEvent_date());
        event1.setEventTime(event.getEvent_time());
        event1.setTitle(event.getTitle());
        event1.setUserId(event.getUser_id());
        event1.setDescription("");
        event1.setEvent_type("meal");
        event1.setRepeating(event.isRepeating());
        event1.setRepeatTimeline(event.getRepeat_timeline());
        event1.setIngredients(event.getIngredients());
        eventService.saveEvent(event1);
        return mealEventsRepository.save(event);
    }

    public List<MealEvents> getEventsByUserId(int userId) {
        Long currentTimeMillis = System.currentTimeMillis();
        return mealEventsRepository.findUpcomingByUserId(userId, currentTimeMillis);
    }

}
