package com.main.omniplanner.responses;

import com.main.omniplanner.user.GenericEvent;

import java.util.List;

public class CalendarEventResponse {

    private List<GenericEvent> events;
    private boolean googleCalendarLinked;

    public CalendarEventResponse(List<GenericEvent> events, boolean googleCalendarLinked) {
        this.events = events;
        this.googleCalendarLinked = googleCalendarLinked;
    }

    public List<GenericEvent> getEvents() {
        return events;
    }

    public void setEvents(List<GenericEvent> events) {
        this.events = events;
    }

    public boolean isGoogleCalendarLinked() {
        return googleCalendarLinked;
    }

    public void setGoogleCalendarLinked(boolean googleCalendarLinked) {
        this.googleCalendarLinked = googleCalendarLinked;
    }
}

