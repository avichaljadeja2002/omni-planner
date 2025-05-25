package com.main.omniplanner.user;

public abstract class EmailCalendarEvent extends GenericEvent implements EmailCalendarInfo {
    // Abstract methods that subclasses must implement
    @Override
    public abstract void setSubtitle(String subtitle);

    @Override
    public abstract String getTitle();
}