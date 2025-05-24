package com.main.omniplanner.CalendarTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.http.HttpRequest;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;

import com.main.omniplanner.calendar.LinkImap;
import com.main.omniplanner.calendar.LinkAdapter;

class LinkAdapterTest {
    @Autowired
    private LinkAdapter linkAdapter;

    @Autowired
    private LinkImap linkImap;

    @Test
    void testLinkCalendar() {
        String token = "4034e083-7065-47d6-bfed-62eb5ba8a06e";
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:8080/link_imap/" + token))
            .header("Authorization", "Bearer " + accessToken)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{}"))
            .build();
        assertEquals(linkAdapter.linkCalendar(request, token), linkImap.linkImap(request, token));
    }

    @Test
    void testGetGoogleCalendarEvents() {
        String access_token = "ya29.a0AW4XtxjEhBkK40ZBkqv-TSmgJ-Kmxiyib-9IYmwCjrzH2Mtwu_0Tfnf8p5kXno4bIVa8pAWSr2c2EX_kwzVkHir_v28iwi67EJnnyLjHTpl238qDrk3OUE79CWBveP2VrhIO7ufVKOhG1eaYiA553DvDAG8IGjghEGC7nnI2aCgYKAaQSARUSFQHGX2MimrAisgI1kHK6HmmTZvSNCw0175";
        assertEquals(linkAdapter.getGoogleCalendarEvents(access_token), linkImap.getImapEvents(access_token));
    }
}