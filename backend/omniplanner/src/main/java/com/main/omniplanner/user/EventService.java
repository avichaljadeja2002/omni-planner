package com.main.omniplanner.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    // Constructor injection
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getEventsByUserId(int userId)
    {
        Long currentTimeMillis = System.currentTimeMillis();
         return eventRepository.findUpcomingByUserId(userId, currentTimeMillis);
    }

    public Event saveEvent(Event event) {return eventRepository.save(event);}

}
