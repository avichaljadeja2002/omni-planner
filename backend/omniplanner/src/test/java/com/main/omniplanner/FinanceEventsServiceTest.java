package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.finance.FinanceEvents;
import com.main.omniplanner.finance.FinanceEventsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;
import java.sql.Date;
import java.sql.Time;

public class FinanceEventsServiceTest {

    private FinanceEventsService financeEventsService;
    private FinanceEvents financeEvents;

    @BeforeEach
    void setUp() {
        financeEventsService = new FinanceEventsService();
    }

    @Test
    public void testGetSaveEvent() {
        financeEvents.setId(0);
        financeEvents.setUser_id(0);
        financeEvents.setTitle("Team Meeting");
        Date date = Date.valueOf("2024-11-05");
        financeEvents.setEvent_date(date);
        Time time = Time.valueOf("10:30:00");
        financeEvents.setEvent_time(time);
        financeEvents.setRepeating(true);
        financeEvents.setRepeat_timeline("weekly");
        financeEvents.setMoney(9.99);
        financeEventsService.saveEvent(financeEvents);
        List<FinanceEvents> financeEventsList = financeEventsService.getEventsByUserId(0);
        FinanceEvents testFinanceEvents = financeEventsList.get(0);
        assertEquals(0, testFinanceEvents.getId());
        assertEquals(0, testFinanceEvents.getUser_id());
        assertEquals("Team Meeting", testFinanceEvents.getTitle());
        assertEquals(date, testFinanceEvents.getEvent_date());
        assertEquals(time, testFinanceEvents.getEvent_time());
        assertEquals(true, testFinanceEvents.isRepeating());
        assertEquals("weekly", testFinanceEvents.getRepeat_timeline());
        assertEquals(9.99, testFinanceEvents.getMoney());
    }
}
