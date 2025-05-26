package com.main.omniplanner.NotesTests;

import com.main.omniplanner.notes.Notes;
import com.main.omniplanner.notes.NotesRepository;
import com.main.omniplanner.notes.NotesService;
import com.main.omniplanner.user.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.*;

public class NotesServiceTest {

    private NotesService notesService;
    private Notes notes;

    @Mock
    private NotesRepository notesRepository;

    @Mock
    private EventService eventService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        notesService = new NotesService(notesRepository, eventService);
        notes = new Notes();
        notes.setId(0);
        notes.setUserId(1);
        notes.setText("This is note 1");
        notes.setEvent_date("2024-11-05");
        notes.setEvent_time("10:30:00");
    }

    @Test
    public void testGetSaveEvent() {
        when(notesRepository.save(notes)).thenReturn(notes);
        when(notesRepository.findByUserId(eq(1)))
                .thenReturn(Collections.singletonList(notes));

        notesService.saveOrUpdateNote(notes, 1);
        List<Notes> notesList = notesService.getNotesByUserId(1);

        assertFalse(notesList.isEmpty(), "The list should not be empty");
        Notes testNotes = notesList.get(0);
        assertEquals(0, testNotes.getId());
        assertEquals(1, testNotes.getUserId());
        assertEquals("This is note 1", testNotes.getText());
        assertEquals("2024-11-05", testNotes.getEvent_date());
        assertEquals("10:30:00", testNotes.getEvent_time());

        verify(notesRepository).save(notes);
        verify(notesRepository, times(2)).findByUserId(eq(1)); // Adjusted to expect 1 call
    }

    @Test
    public void testSaveNewNote() {
        when(notesRepository.findByUserId(eq(1)))
                .thenReturn(Collections.emptyList());
        when(notesRepository.save(notes)).thenReturn(notes);
        Notes savedNote = notesService.saveOrUpdateNote(notes, 1);
        assertEquals(notes, savedNote);
        verify(notesRepository).save(notes);
        verify(notesRepository, times(1)).findByUserId(eq(1)); // Only one call should happen here
    }

    @Test
    void testUpdateExistingNote() {
        Notes inputNote = new Notes();
        inputNote.setText("Updated Note");

        Notes existing = new Notes();
        existing.setText("Old Note");

        List<Notes> existingList = List.of(existing);

        when(notesRepository.findByUserId(1)).thenReturn(existingList);
        when(notesRepository.save(existing)).thenReturn(existing);

        Notes result = notesService.saveOrUpdateNote(inputNote, 1);

        assertEquals("Updated Note", result.getText()); // Checks mutation on text
        verify(notesRepository).save(existing);         // Catches wrong save target
    }

    @Test
    void testMultipleExistingNotes_OnlyFirstUpdated() {
        Notes inputNote = new Notes();
        inputNote.setText("Fresh Text");

        Notes existing1 = new Notes();
        existing1.setText("Old 1");

        Notes existing2 = new Notes();
        existing2.setText("Old 2");

        List<Notes> existingList = List.of(existing1, existing2);

        when(notesRepository.findByUserId(3)).thenReturn(existingList);
        when(notesRepository.save(existing1)).thenReturn(existing1);

        Notes result = notesService.saveOrUpdateNote(inputNote, 3);

        assertEquals("Fresh Text", result.getText());   // Validates setText usage
        verify(notesRepository).save(existing1);        // Prevents saving wrong index
        verify(notesRepository, never()).save(existing2);
    }
}