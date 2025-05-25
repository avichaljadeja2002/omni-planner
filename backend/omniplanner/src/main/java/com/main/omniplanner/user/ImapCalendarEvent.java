package com.main.omniplanner.user;

public class ImapCalendarEvent extends EmailCalendarEvent {

    private String subtitle;
    private String email_type = "Imap";

    // Implement the setSubtitle() method from EmailCalendarInfo
    @Override
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    // Implement the getTitle() method from EmailCalendarInfo
    @Override
    public String getTitle() {
        return email_type + ": " + subtitle;
    }
}