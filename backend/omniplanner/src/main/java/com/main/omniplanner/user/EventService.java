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

    public List<GenericEvent> getEventsByUserId(int userId)
    {
        Long currentTimeMillis = System.currentTimeMillis();
         return eventRepository.findUpcomingByUserId(userId, currentTimeMillis);
    }

    public List<GenericEvent> getEventsByType(String event_type, int userId) {
        Long currentTimeMillis = System.currentTimeMillis();
        return eventRepository.findByEventType(event_type, userId, currentTimeMillis);
    }

    public GenericEvent saveEvent(GenericEvent event, String event_type) {
        event.setEvent_type(event_type);
        return eventRepository.save(event);
    }

}
