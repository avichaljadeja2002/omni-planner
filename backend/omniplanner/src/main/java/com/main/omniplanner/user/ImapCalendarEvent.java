package com.main.omniplanner.user;

import com.main.omniplanner.user.*;

public class ImapCalendarEvent extends EmailCalendarEvent {

    public String getLabel() {
        return "Imap: " + getTitle();
    }
    
    public String getEmail_type() {
        return "Imap";
    }
}