package com.main.omniplanner.user;

import com.main.omniplanner.user.*;

public class GmailCalendarEvent extends EmailCalendarEvent {

    public String getLabel() {
        return "Google: " + getTitle();
    }
    
    public String getEmail_type() {
        return "Google";
    }
}