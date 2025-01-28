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

    @Column
    private String token;
    @Column
    private String phone;
    @Column
    private String age;

    @Column()
    private boolean enabled;

    @Column()
    private String name;

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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String generateToken() {
        return UUID.randomUUID().toString();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getAge() {
        return age;
    }
    public void setAge(String age) {
        this.age = age;
    }

}
