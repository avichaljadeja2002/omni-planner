package com.main.omniplanner.notes;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "notes")
public class Notes {

    @Id
    @GeneratedValue
    private int id;

    private int userId;

    private String text;

    private Date event_date;

    private Time event_time;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getEvent_date() {
        return event_date;
    }
    public void setEvent_date(Date event_date) {
        this.event_date = event_date;
    }
    public Time getEvent_time() {
        return event_time;
    }
    public void setEvent_time(Time event_time) {
        this.event_time = event_time;
    }

}

