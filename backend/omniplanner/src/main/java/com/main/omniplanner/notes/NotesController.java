package com.main.omniplanner.notes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class NotesController {

    @Autowired
    private NotesService notesService;

    public NotesController(NotesService notesService) {
        this.notesService = notesService;
    }

    @PostMapping("/add_note")
    public ResponseEntity<Notes> addNote(@RequestBody Notes note) {
        Notes savedNote = notesService.saveNote(note);
        return new ResponseEntity<>(savedNote, HttpStatus.CREATED);
    }
    @GetMapping("/get_note/{userId}")
    public ResponseEntity<List<Notes>> getNotesByUserId(@PathVariable int userId) {
        List<Notes> notes = notesService.getNotesByUserId(userId);
        return ResponseEntity.ok(notes);
    }

}
