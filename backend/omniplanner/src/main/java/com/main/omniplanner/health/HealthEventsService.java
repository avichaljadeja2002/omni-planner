package com.main.omniplanner.health;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthEventsService {

    @Autowired
    private HealthEventsRepository healthEventsRepository;

    public HealthEvents saveEvent(HealthEvents event) {
        return healthEventsRepository.save(event);
    }

    public List<HealthEvents> getEventsByUserId(int userId) {
        return healthEventsRepository.findByUserId(userId);
    }

}
