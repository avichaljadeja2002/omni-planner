package com.main.omniplanner.meals;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "mealEvents")
public class MealEvents {

    @Id
    @GeneratedValue
    private int id;

    private int userId;

    private String title;

    private Date event_date;

    private Time event_time;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUser_id() {
        return userId;
    }

    public void setUser_id(int user_id) {
        this.userId = user_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

