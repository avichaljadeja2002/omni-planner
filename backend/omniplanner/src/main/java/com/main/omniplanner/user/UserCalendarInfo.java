package com.main.omniplanner.user;

public class UserCalendarInfo {
    private int id;
    private boolean isGoogleCalendarLinked;
    private String googleCalendarAccessToken;

    public UserCalendarInfo(int id, boolean isGoogleCalendarLinked, String googleCalendarAccessToken) {
        this.id = id;
        this.isGoogleCalendarLinked = isGoogleCalendarLinked;
        this.googleCalendarAccessToken = googleCalendarAccessToken;
    }

    public UserCalendarInfo() {

    }

    public int getId() {
        return id;
    }

    public boolean isGoogleCalendarLinked() {
        return isGoogleCalendarLinked;
    }

    public String getGoogleCalendarAccessToken() {
        return googleCalendarAccessToken;
    }

    @Override
    public String toString() {
        return "UserCalendarInfo{" +
                "id=" + id +
                ", isGoogleCalendarLinked=" + isGoogleCalendarLinked +
                ", googleCalendarAccessToken='" + (googleCalendarAccessToken != null ? "[present]" : "[null]") + '\'' + // Avoid printing token directly in logs
                '}';
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setGoogleCalendarLinked(boolean googleCalendarLinked) {
        isGoogleCalendarLinked = googleCalendarLinked;
    }

    public void setGoogleCalendarAccessToken(String googleCalendarAccessToken) {
        this.googleCalendarAccessToken = googleCalendarAccessToken;
    }
}