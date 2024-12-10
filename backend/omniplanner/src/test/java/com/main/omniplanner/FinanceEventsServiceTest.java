package com.main.omniplanner;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.main.omniplanner.finance.FinanceEvents;
import com.main.omniplanner.finance.FinanceEventsService;
import com.main.omniplanner.finance.FinanceEventsRepository;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;
import java.sql.Date;
import java.sql.Time;

public class FinanceEventsServiceTest {

    private FinanceEventsService financeEventsService;
    private FinanceEvents financeEvents;

    @Mock
    private FinanceEventsRepository financeEventsRepository;

    @Mock
    private EventService eventService;

    private Date date;
    private Time time;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        financeEventsService = new FinanceEventsService(financeEventsRepository, eventService);
        financeEvents = new FinanceEvents();
        financeEvents.setId(0);
        financeEvents.setUser_id(0);
        financeEvents.setTitle("Team Meeting");
        date = Date.valueOf("2024-11-05");
        financeEvents.setEvent_date(date);
        time = Time.valueOf("10:30:00");
        financeEvents.setEvent_time(time);
        financeEvents.setRepeating(true);
        financeEvents.setRepeat_timeline("weekly");
        financeEvents.setMoney(9.99);
    }

    @Test
    public void testGetSaveEvent() {
        when(financeEventsRepository.save(financeEvents)).thenReturn(financeEvents);
        when(financeEventsRepository.findUpcomingByUserId(eq(0), anyLong()))
                .thenReturn(Collections.singletonList(financeEvents));

        financeEventsService.saveEvent(financeEvents);
        List<FinanceEvents> financeEventsList = financeEventsService.getEventsByUserId(0);
        assertFalse(financeEventsList.isEmpty(), "The list should not be empty");
        FinanceEvents testFinanceEvents = financeEventsList.get(0);
        assertEquals(0, testFinanceEvents.getId());
        assertEquals(0, testFinanceEvents.getUser_id());
        assertEquals("Team Meeting", testFinanceEvents.getTitle());
        assertEquals(date, testFinanceEvents.getEvent_date());
        assertEquals(time, testFinanceEvents.getEvent_time());
        assertEquals(true, testFinanceEvents.isRepeating());
        assertEquals("weekly", testFinanceEvents.getRepeat_timeline());
        assertEquals(9.99, testFinanceEvents.getMoney());

        verify(financeEventsRepository).save(financeEvents);
        verify(financeEventsRepository).findUpcomingByUserId(eq(0), anyLong());
    }
}
