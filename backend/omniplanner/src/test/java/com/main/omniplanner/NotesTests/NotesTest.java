package com.main.omniplanner.NotesTests;

import com.main.omniplanner.notes.Notes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.sql.Time;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class NotesTest {

    private Notes notes;

    @BeforeEach
    void setUp() {
        notes = new Notes();
    }

    @Test
    public void testGetSetId() {
        notes.setId(0);
        assertEquals(0, notes.getId());
    }

    @Test
    public void testGetSetUserId() {
        notes.setUserId(0);
        assertEquals(0, notes.getUserId());
    }

    @Test
    public void testGetSetEvent_date() {
        Date date = Date.valueOf("2024-11-05");
        notes.setEvent_date(date);
        assertEquals(date, notes.getEvent_date());
    }

    @Test
    public void testGetSetEvent_time() {
        Time time = Time.valueOf("10:30:00");
        notes.setEvent_time(time);
        assertEquals(time, notes.getEvent_time());
    }

    @Test
    public void testGetSetText() {
        notes.setText("This is a note");
        assertEquals("This is a note", notes.getText());
    }

}