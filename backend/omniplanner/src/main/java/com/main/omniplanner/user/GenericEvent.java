package com.main.omniplanner.user;

import jakarta.persistence.*;

@Entity
@Table(name = "all_events")
public class GenericEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String event_date;

    private String event_type;

    private String description;

    private String event_time;

    private float money;

    private Integer repeat_timeline;

    private Boolean repeating;

    private String title;

    private int userId;

    private String ingredients;

    // Getters and Setters
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
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

    public float getMoney() {
        return money;
    }

    public void setMoney(float money) {
        this.money = money;
    }

    public Integer getRepeat_timeline() {
        return repeat_timeline;
    }

    public void setRepeat_timeline(Integer repeat_timeline) {
        this.repeat_timeline = repeat_timeline;
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

    public String getIngredients() {
        return ingredients;
    }
    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }
}
