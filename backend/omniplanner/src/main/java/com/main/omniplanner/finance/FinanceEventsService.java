package com.main.omniplanner.finance;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinanceEventsService {

    @Autowired
    private FinanceEventsRepository financeEventsRepository;

    @Autowired
    private EventService eventService;

    // Constructor injection
    public FinanceEventsService(FinanceEventsRepository financeEventsRepository, EventService eventService) {
        this.financeEventsRepository = financeEventsRepository;
        this.eventService = eventService;
    }

    public FinanceEvents saveEvent(FinanceEvents event) {
        Event event1 = new Event();
        event1.setEventDate(event.getEvent_date());
        event1.setEventTime(event.getEvent_time());
        event1.setTitle(event.getTitle());
        event1.setUserId(event.getUserId());
        event1.setEvent_type("finance");
        event1.setRepeating(event.isRepeating());
        event1.setRepeatTimeline(event.getRepeat_timeline());
        eventService.saveEvent(event1);
        System.out.println(event.getEvent_time());
        return financeEventsRepository.save(event);
    }

    public List<FinanceEvents> getEventsByUserId(int userId) {
        Long currentTimeMillis = System.currentTimeMillis();
        return financeEventsRepository.findUpcomingByUserId(userId, currentTimeMillis);
    }

    public void updateEvent(FinanceEvents event) {
        financeEventsRepository.updateEvent(event.getId(), event.getTitle(), event.getEvent_date(), event.getEvent_time(), event.isRepeating(), event.getRepeat_timeline(), event.getMoney());
    }

}
