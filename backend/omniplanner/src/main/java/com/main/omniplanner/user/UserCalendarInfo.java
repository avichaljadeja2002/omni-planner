package com.main.omniplanner.user;

public class UserCalendarInfo {
    private int id;
    private boolean isGoogleCalendarLinked;
    private String googleCalendarAccessToken;
    private boolean isImapLinked;
    private String imapAccessToken;

    public UserCalendarInfo(int id, boolean isGoogleCalendarLinked, String googleCalendarAccessToken, boolean isImapLinked, String imapAccessToken) {
        this.id = id;
        this.isGoogleCalendarLinked = isGoogleCalendarLinked;
        this.googleCalendarAccessToken = googleCalendarAccessToken;
        this.isImapLinked = isImapLinked;
        this.imapAccessToken = imapAccessToken;
    }

    public UserCalendarInfo() {

    }

    public int getId() {
        return id;
    }

    public boolean isGoogleCalendarLinked() {
        return isGoogleCalendarLinked;
    }

    public boolean isImapLinked() {
        return isImapLinked;
    }

    public String getGoogleCalendarAccessToken() {
        return googleCalendarAccessToken;
    }

    public String getImapAccessToken() {
        return imapAccessToken;
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

    public void setImapLinked(boolean imapLinked) {
        isImapLinked = imapLinked;
    }

    public void setGoogleCalendarAccessToken(String googleCalendarAccessToken) {
        this.googleCalendarAccessToken = googleCalendarAccessToken;
    }

    public void setImapAccessToken(String imapAccessToken) {
        this.imapAccessToken = imapAccessToken;
    }
}