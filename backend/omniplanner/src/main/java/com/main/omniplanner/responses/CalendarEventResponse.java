package com.main.omniplanner.responses;

import com.main.omniplanner.user.GenericEvent;

import java.util.List;

public class CalendarEventResponse {

    private List<GenericEvent> events;
    private boolean googleCalendarLinked;
    private boolean imapLinked;

    public CalendarEventResponse(List<GenericEvent> events, boolean googleCalendarLinked, boolean imapLinked) {
        this.events = events;
        this.googleCalendarLinked = googleCalendarLinked;
        this.imapLinked = imapLinked;
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

    public boolean isImapLinked() {
        return imapLinked;
    }

    public void setImapLinked(boolean imapLinked) {
        this.imapLinked = imapLinked;
    }
}

