package com.main.omniplanner.notes;

import com.main.omniplanner.user.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotesService {

    @Autowired
    private NotesRepository notesRepository;

    @Autowired
    private EventService eventService;

    // Constructor injection
    public NotesService(NotesRepository notesRepository, EventService eventService) {
        this.notesRepository = notesRepository;
        this.eventService = eventService;
    }
    public Notes saveOrUpdateNote(Notes note, Integer userId) {
        // Check if a note for the given userId already exists
        List<Notes> existingNote = notesRepository.findByUserId(userId);
        if (existingNote.size() > 0) {
            // Update the existing note
            existingNote.get(0).setText(note.getText());
            return notesRepository.save(existingNote.get(0));  // Save the updated note
        } else {
            // No existing note, create a new one
            note.setUserId(userId);
            return notesRepository.save(note);
        }
    }

    public List<Notes> getNotesByUserId(Integer userId) {
        return notesRepository.findByUserId(userId);
    }

}
