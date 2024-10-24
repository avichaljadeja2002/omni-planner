package com.main.omniplanner.responses;

import com.main.omniplanner.calendar.CalendarEvents;

import java.util.List;

public class CalendarEventResponse {

    private List<CalendarEvents> events;
    private boolean googleCalendarLinked;

    public CalendarEventResponse(List<CalendarEvents> events, boolean googleCalendarLinked) {
        this.events = events;
        this.googleCalendarLinked = googleCalendarLinked;
    }

    public List<CalendarEvents> getEvents() {
        return events;
    }

    public void setEvents(List<CalendarEvents> events) {
        this.events = events;
    }

    public boolean isGoogleCalendarLinked() {
        return googleCalendarLinked;
    }

    public void setGoogleCalendarLinked(boolean googleCalendarLinked) {
        this.googleCalendarLinked = googleCalendarLinked;
    }
}

