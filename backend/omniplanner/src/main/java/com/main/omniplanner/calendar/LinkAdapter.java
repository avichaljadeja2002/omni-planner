package com.main.omniplanner.calendar;

import com.main.omniplanner.calendar.LinkGoogleCalendar;
import com.main.omniplanner.calendar.LinkImap;
import com.main.omniplanner.requests.CalendarLinkRequest;
import java.util.List;
import com.main.omniplanner.user.GenericEvent;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.stereotype.Service;

@Service
public class LinkAdapter extends LinkGoogleCalendar {

    private LinkImap linkImap = new LinkImap();

    @Override
    public String linkCalendar(@RequestBody CalendarLinkRequest request, @PathVariable String token) {
        return linkImap.linkImap(request, token);
    }

    @Override
    public List<GenericEvent> getGoogleCalendarEvents(@RequestParam String access_token) {
        return linkImap.getImapEvents(access_token);
    }
};