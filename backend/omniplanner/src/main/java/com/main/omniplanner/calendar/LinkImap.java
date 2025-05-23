package com.main.omniplanner.calendar;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.main.omniplanner.requests.CalendarLinkRequest;
import com.main.omniplanner.user.GenericEvent;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import java.util.Properties;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.NoSuchProviderException;
import jakarta.mail.Session;
import jakarta.mail.Store;

import java.util.Date;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestController
@CrossOrigin
public class LinkImap {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "omniplanner";

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/link_imap/{token}")
    public String linkCalendar(@RequestBody CalendarLinkRequest request, @PathVariable String token) {
        Integer userId = userRepository.getIdByToken(token);
        try {
            System.out.println("Linking Imap for user ID: " + userId);
            User user = userRepository.findById(String.valueOf(userId))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setImapLinked(true);
            user.setImapAccessToken(request.getAccessToken());
            userRepository.save(user);
            return "Imap linked successfully for user ID: " + userId;
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to link Imap for user ID: " + userId;
        }
    }

    @GetMapping("/get_imap_events")
    public List<GenericEvent> getImapEvents(@RequestParam String access_token) {
        List<GenericEvent> calendarEventsList = new ArrayList<>();
        try {
            HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY,
                    request -> request.getHeaders().setAuthorization("Bearer " + access_token))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            Properties props = System.getProperties();
            props.setProperty("mail.store.protocol", "imaps");
            try {
                Session session = Session.getDefaultInstance(props, null);
                Store store = session.getStore("imaps");
                store.connect("imap.gmail.com", "omniplannertest@gmail.com", "ctoz vfbh onjx dbja");
                Folder inbox = store.getFolder("Inbox");
                inbox.open(Folder.READ_ONLY);
                Message messages[] = inbox.getMessages();
                int i = 0;
                for(Message message:messages) {
                    calendarEventsList.add(new GenericEvent());
                    calendarEventsList.get(i).setId(i);
                    calendarEventsList.get(i).setTitle("IMAP: " + message.getSubject());
                    calendarEventsList.get(i).setEvent_type("imap");
                    Date date = message.getReceivedDate();
                    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                    LocalDateTime localDateTime = Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
                    String formattedDate = localDateTime.format(dateFormatter);
                    String formattedTime = localDateTime.format(timeFormatter);
                    if (date != null) {
                        calendarEventsList.get(i).setEvent_date(formattedDate); // Set the formatted String
                        calendarEventsList.get(i).setEvent_time(formattedTime);
                    }
                    i++;
                }
            } catch (NoSuchProviderException e) {
                e.printStackTrace();
                System.exit(1);
            } catch (MessagingException e) {
                e.printStackTrace();
                System.exit(2);
            }
        } catch (IOException | GeneralSecurityException e) {
            e.printStackTrace();
        }
        return calendarEventsList;
    }
}
