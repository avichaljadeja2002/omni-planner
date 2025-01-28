package com.main.omniplanner.notes;

import com.main.omniplanner.user.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    public NotesController(NotesService notesService, UserRepository userRepository) {
        this.notesService = notesService;
        this.userRepository = userRepository;
    }

    @PutMapping("/add_note/{token}")
    public ResponseEntity<Notes> addNote(@RequestBody Notes note, @PathVariable String token) {
        int userId = userRepository.getIdByToken(token);
        Notes savedNote = notesService.saveOrUpdateNote(note, userId);
        return new ResponseEntity<>(savedNote, HttpStatus.CREATED);
    }
    @GetMapping("/get_note/{token}")
    public ResponseEntity<List<Notes>> getNotesByUserId(@PathVariable String token) {
        int userId = userRepository.getIdByToken(token);
        List<Notes> notes = notesService.getNotesByUserId(userId);
        return ResponseEntity.ok(notes);
    }


}
