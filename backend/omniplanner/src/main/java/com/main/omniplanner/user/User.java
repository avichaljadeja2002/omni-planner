package com.main.omniplanner.user;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column()
    private String password;

    @Column()
    private boolean enabled;

    @Column(name = "google_calendar_linked")
    private boolean googleCalendarLinked = false;

    @Column(name = "google_calendar_access_token")
    private String googleCalendarAccessToken;
    @Column(name = "is_google_login", nullable = false)
    private boolean isGoogleLogin = false;

    public boolean isGoogleLogin() {
        return isGoogleLogin;
    }

    public void setGoogleLogin(boolean isGoogleLogin) {
        this.isGoogleLogin = isGoogleLogin;
    }


    public User() {}

    public User(String username, String password, boolean enabled) {
        this.username = username;
        this.password = password;
        this.enabled = enabled;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isGoogleCalendarLinked() {
        return googleCalendarLinked;
    }

    public void setGoogleCalendarLinked(boolean googleCalendarLinked) {
        this.googleCalendarLinked = googleCalendarLinked;
    }

    public String getGoogleCalendarAccessToken() {
        return googleCalendarAccessToken;
    }

    public void setGoogleCalendarAccessToken(String googleCalendarAccessToken) {
        this.googleCalendarAccessToken = googleCalendarAccessToken;
    }
}
