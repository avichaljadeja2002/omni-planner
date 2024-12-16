package com.main.omniplanner.notes;

import com.main.omniplanner.user.Event;
import com.main.omniplanner.user.EventRepository;
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

    public Notes saveEvent(Notes event) {
        Event event1 = new Event();
        event1.setText(event.getText());
        event1.setUserId(event.getUserId());
        return notesRepository.save(event);
    }

    public List<Notes> getEventsByUserId(int userId) {
        return notesRepository.findByUserId(userId);
    }

}
