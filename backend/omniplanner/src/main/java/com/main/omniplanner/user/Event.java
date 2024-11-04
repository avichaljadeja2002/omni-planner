package com.main.omniplanner.user;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "all_events")
public class Event {

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "event_date")
    private Date eventDate;

    @Column(name = "event_type")
    private String event_type;
    @Column(name = "description")
    private String description;

    @Column(name = "event_time")
    private Time eventTime;

    @Column(name = "money")
    private float money;

    @Column(name = "repeat_timeline", length = 50)
    private String repeatTimeline;

    @Column(name = "repeating")
    private Boolean repeating;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "user_id")
    private int userId;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public Time getEventTime() {
        return eventTime;
    }

    public void setEventTime(Time eventTime) {
        this.eventTime = eventTime;
    }

    public float getMoney() {
        return money;
    }

    public void setMoney(float money) {
        this.money = money;
    }

    public String getRepeatTimeline() {
        return repeatTimeline;
    }

    public void setRepeatTimeline(String repeatTimeline) {
        this.repeatTimeline = repeatTimeline;
    }

    public Boolean getRepeating() {
        return repeating;
    }

    public void setRepeating(Boolean repeating) {
        this.repeating = repeating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getUser() {
        return userId;
    }

    public void setUserID(int userID) {
        this.userId = userID;
    }

    public String getEvent_type() {
        return event_type;
    }

    public void setEvent_type(String event_type) {
        this.event_type = event_type;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
