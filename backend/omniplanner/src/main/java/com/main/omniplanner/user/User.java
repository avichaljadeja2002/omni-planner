package com.main.omniplanner.user;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String email;
    private boolean google_calendar_linked;
    private String google_calendar_access_token;
    private String userName;
    private String passwordHash;
    private String salt;
    private String tempToken;

    public int getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public boolean isGoogle_calendar_linked() {
        return google_calendar_linked;
    }

    public void setGoogle_calendar_linked(boolean google_calendar_linked) {
        this.google_calendar_linked = google_calendar_linked;
    }

    public String getGoogle_calendar_access_token() {
        return google_calendar_access_token;
    }

    public void setGoogle_calendar_access_token(String google_calendar_access_token) {
        this.google_calendar_access_token = google_calendar_access_token;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public String getSalt() {
        return salt;
    }
    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getTempToken() {
        return tempToken;
    }

    public void setTempToken(String tempToken) {
        this.tempToken = tempToken;
    }

    public String toString() {
        return this.id +"," + this.userName + "," + this.email + "," + this.name + "," + this.tempToken;
    }
}
