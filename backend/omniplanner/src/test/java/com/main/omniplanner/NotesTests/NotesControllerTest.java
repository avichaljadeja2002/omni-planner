package com.main.omniplanner.NotesTests;


import com.main.omniplanner.notes.Notes;
import com.main.omniplanner.notes.NotesController;
import com.main.omniplanner.notes.NotesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class NotesControllerTest {

    @Mock
    private NotesService notesService;

    private NotesController notesController;
    Notes note1;
    Notes note2;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        notesController = new NotesController(notesService);
        note1 = new Notes();
        note1.setId(1);
        note1.setUserId(1);
        note1.setText("This is note 1");
        note1.setEvent_date("2023-10-01");
        note1.setEvent_time("10:00:00");

        note2 = new Notes();
        note2.setId(1);
        note2.setUserId(1);
        note2.setText("This is note 2");
        note2.setEvent_date("2023-10-01");
        note2.setEvent_time("10:00:00");
    }

    @Test
    void testGetNoteByUserId_Success() {
        when(notesService.getNotesByUserId(1)).thenReturn(Collections.singletonList(note1));
        ResponseEntity<List<Notes>> response = notesController.getNotesByUserId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).size());
        // Assert for the first event
        assertEquals("This is note 1", response.getBody().get(0).getText());
        assertEquals(1, response.getBody().get(0).getUserId());
        assertEquals("2023-10-01", response.getBody().get(0).getEvent_date());
        assertEquals("10:00:00", response.getBody().get(0).getEvent_time());
    }

    @Test
    void testGetEventsByUserId_EmptyList() {
        when(notesService.getNotesByUserId(2)).thenReturn(Arrays.asList());
        ResponseEntity<List<Notes>> response = notesController.getNotesByUserId(2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetEventsByUserId_NonExistingUser() {
        when(notesService.getNotesByUserId(999)).thenReturn(Arrays.asList());
        ResponseEntity<List<Notes>> response = notesController.getNotesByUserId(999);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }
    @Test
    void testAddEvent_Success() {
        // When
        when(notesService.saveOrUpdateNote(note1)).thenReturn(note1);

        // Act
        ResponseEntity<Notes> response = notesController.addNote(note1);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("This is note 1", response.getBody().getText());
    }

    @Test
    void testUpdateEvent_Success() {
        // When
        when(notesService.saveOrUpdateNote(note1)).thenReturn(note1);
        when(notesService.saveOrUpdateNote(note2)).thenReturn(note2);
        // Act
        ResponseEntity<Notes> response = notesController.addNote(note1);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("This is note 1", response.getBody().getText());
        // Act
        response = notesController.addNote(note2);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, Objects.requireNonNull(response.getBody()).getId());
        assertEquals("This is note 2", response.getBody().getText());
    }
}
