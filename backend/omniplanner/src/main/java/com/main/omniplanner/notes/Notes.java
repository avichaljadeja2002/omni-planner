package com.main.omniplanner.notes;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "notes")
public class Notes {

    @Id
    @GeneratedValue
    private int id;

    private Integer userId;

    private String text;

    private String event_date;

    private String event_time;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
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

    public String getEvent_date() {
        return event_date;
    }
    public void setEvent_date(String event_date) {
        this.event_date = event_date;
    }
    public String getEvent_time() {
        return event_time;
    }
    public void setEvent_time(String event_time) {
        this.event_time = event_time;
    }

}

