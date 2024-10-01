package com.main.omniplanner.meals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MealEventsService {

    @Autowired
    private MealEventsRepository mealEventsRepository;

    public MealEvents saveEvent(MealEvents event) {
        return mealEventsRepository.save(event);
    }

    public List<MealEvents> getEventsByUserId(int userId) {
        return mealEventsRepository.findByUserId(userId);
    }

}
