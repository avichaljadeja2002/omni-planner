package com.main.omniplanner.CalendarTests;

import org.junit.jupiter.api.Test;

import java.net.http.HttpRequest;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;

import com.main.omniplanner.calendar.LinkImap;
import com.main.omniplanner.calendar.LinkAdapter;
import com.main.omniplanner.requests.CalendarLinkRequest;
import java.io.IOException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.springframework.beans.factory.annotation.Autowired;

class LinkAdapterTest {
    @Autowired
    private LinkAdapter linkAdapter  = new LinkAdapter();

    @Autowired
    private LinkImap linkImap;

    @Test
    void testLinkCalendar() {
        String token = "4034e083-7065-47d6-bfed-62eb5ba8a06e";
        String accessToken = "ya29.a0AW4XtxjEhBkK40ZBkqv-TSmgJ-Kmxiyib-9IYmwCjrzH2Mtwu_0Tfnf8p5kXno4bIVa8pAWSr2c2EX_kwzVkHir_v28iwi67EJnnyLjHTpl238qDrk3OUE79CWBveP2VrhIO7ufVKOhG1eaYiA553DvDAG8IGjghEGC7nnI2aCgYKAaQSARUSFQHGX2MimrAisgI1kHK6HmmTZvSNCw0175";
        CalendarLinkRequest request = new CalendarLinkRequest();
        request.setAccessToken(accessToken);
        String response = linkAdapter.linkCalendar(request, token);
        assertEquals(response.contains("success"), true);
    }

    // @Test
    // void testGetGoogleCalendarEvents() {
    //     String access_token = "ya29.a0AW4XtxjEhBkK40ZBkqv-TSmgJ-Kmxiyib-9IYmwCjrzH2Mtwu_0Tfnf8p5kXno4bIVa8pAWSr2c2EX_kwzVkHir_v28iwi67EJnnyLjHTpl238qDrk3OUE79CWBveP2VrhIO7ufVKOhG1eaYiA553DvDAG8IGjghEGC7nnI2aCgYKAaQSARUSFQHGX2MimrAisgI1kHK6HmmTZvSNCw0175";
    //     assertEquals(linkAdapter.getGoogleCalendarEvents(access_token), linkImap.getImapEvents(access_token));
    // }
}