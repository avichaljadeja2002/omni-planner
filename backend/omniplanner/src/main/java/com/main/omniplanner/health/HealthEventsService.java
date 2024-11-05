package com.main.omniplanner.health;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthEventsService {

    @Autowired
    private HealthEventsRepository healthEventsRepository;

    @Autowired
    private EventService eventService;


    public HealthEvents saveEvent(HealthEvents event) {
        Event event1 = new Event();
        event1.setEventDate(event.getEvent_date());
        event1.setEventTime(event.getEvent_time());
        event1.setTitle(event.getTitle());
        event1.setUserID(event.getUser_id());
        event1.setEvent_type("health");
        event1.setRepeating(event.isRepeating());
        event1.setRepeatTimeline(event.getRepeat_timeline());
        eventService.saveEvent(event1);
        return healthEventsRepository.save(event);
    }

    public List<HealthEvents> getEventsByUserId(int userId) {
        Long currentTimeMillis = System.currentTimeMillis();
        return healthEventsRepository.findUpcomingByUserId(userId, currentTimeMillis);
    }

}
