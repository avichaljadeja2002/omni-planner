package com.main.omniplanner.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // Constructor injection
    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public List<GenericEvent> getEventsByUserId(Integer userId)
    {
        Long currentTimeMillis = System.currentTimeMillis();
         return eventRepository.findUpcomingByUserId(userId, currentTimeMillis);
    }

    public List<GenericEvent> getEventsByType(String event_type, Integer userId) {
        Long currentTimeMillis = System.currentTimeMillis();
        return eventRepository.findByEventType(event_type, userId, currentTimeMillis);
    }

    public GenericEvent saveEvent(GenericEvent event, String event_type, String token) {
        Integer userId = userRepository.getIdByToken(token);
        event.setEvent_type(event_type);
        event.setUserId(userId);
        return eventRepository.save(event);
    }

}
