package com.main.omniplanner.user;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    private int id;
    private String name;
    private String email;

    private boolean google_calendar_linked;

    private String google_calendar_access_token;
    public int getId() {
        return id;
    }

    public void setId(int id) {
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
}
