package com.main.omniplanner.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    public List<Event> getEventsByUserId(int userId) {
        return eventRepository.findByUserId(userId);
    }

    public Event saveEvent(Event event) {return eventRepository.save(event);}

}
