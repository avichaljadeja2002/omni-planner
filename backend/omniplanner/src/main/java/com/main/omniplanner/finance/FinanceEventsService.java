package com.main.omniplanner.finance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinanceEventsService {

    @Autowired
    private FinanceEventsRepository financeEventsRepository;

    public FinanceEvents saveEvent(FinanceEvents event) {
        return financeEventsRepository.save(event);
    }

    public List<FinanceEvents> getEventsByUserId(int userId) {
        return financeEventsRepository.findByUserId(userId);
    }

}
