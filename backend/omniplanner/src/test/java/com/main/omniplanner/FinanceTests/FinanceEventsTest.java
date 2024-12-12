package com.main.omniplanner.FinanceTests;

import static org.junit.jupiter.api.Assertions.*;

import com.main.omniplanner.finance.FinanceEvents;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

public class FinanceEventsTest {

    private FinanceEvents financeEvents;

    @BeforeEach
    void setUp() {
        financeEvents = new FinanceEvents();
    }

    @Test
    public void testGetSetId() {
        financeEvents.setId(0);
        assertEquals(0, financeEvents.getId());
    }

    @Test
    public void testGetSetUser_id() {
        financeEvents.setUser_id(0);
        assertEquals(0, financeEvents.getUser_id());
    }

    @Test
    public void testGetSetTitle() {
        financeEvents.setTitle("Team Meeting");
        assertEquals("Team Meeting", financeEvents.getTitle());
    }

    @Test
    public void testGetSetEvent_date() {
        Date date = Date.valueOf("2024-11-05");
        financeEvents.setEvent_date(date);
        assertEquals(date, financeEvents.getEvent_date());
    }

    @Test
    public void testGetSetEvent_time() {
        Time time = Time.valueOf("10:30:00");
        financeEvents.setEvent_time(time);
        assertEquals(time, financeEvents.getEvent_time());
    }

    @Test
    public void testGetSetRepeating() {
        financeEvents.setRepeating(true);
        assertEquals(true, financeEvents.isRepeating());
    }

    @Test
    public void testGetSetRepeat_timeline() {
        financeEvents.setRepeat_timeline("weekly");
        assertEquals("weekly", financeEvents.getRepeat_timeline());
    }

    @Test
    public void testGetSetMoney() {
        financeEvents.setMoney(9.99);
        assertEquals(9.99, financeEvents.getMoney());
    }
}
