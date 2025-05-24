package com.main.omniplanner.CalendarTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

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

class LinkAdapterTest {
    @Autowired
    private LinkAdapter linkAdapter;

    @Autowired
    private LinkImap linkImap;

    @Test
    void testLinkCalendar() {
        // String accessToken = "ya29.a0AW4XtxjEhBkK40ZBkqv-TSmgJ-Kmxiyib-9IYmwCjrzH2Mtwu_0Tfnf8p5kXno4bIVa8pAWSr2c2EX_kwzVkHir_v28iwi67EJnnyLjHTpl238qDrk3OUE79CWBveP2VrhIO7ufVKOhG1eaYiA553DvDAG8IGjghEGC7nnI2aCgYKAaQSARUSFQHGX2MimrAisgI1kHK6HmmTZvSNCw0175";
        String token = "4034e083-7065-47d6-bfed-62eb5ba8a06e";
        // HttpClient client = HttpClient.newHttpClient();
        // HttpRequest request = HttpRequest.newBuilder()
        //     .uri(URI.create("http://localhost:8080/link_imap/" + token))
        //     .header("Authorization", "Bearer " + accessToken)
        //     .header("Content-Type", "application/json")
        //     .POST(HttpRequest.BodyPublishers.ofString("{}"))
        //     .build();
        // HttpResponse<String> response = null;
        // try {
        //     response = client.send(request, HttpResponse.BodyHandlers.ofString());
        //     System.out.println(response.statusCode());
        //     System.out.println(response.body());
        // } catch (IOException | InterruptedException e) {
        //     e.printStackTrace();
        // }
        CalendarLinkRequest request = new CalendarLinkRequest();
        assertEquals(
            (new linkAdapter).linkCalendar(request, token).contains("successfully"),
            true
        );
    }

    // @Test
    // void testGetGoogleCalendarEvents() {
    //     String access_token = "ya29.a0AW4XtxjEhBkK40ZBkqv-TSmgJ-Kmxiyib-9IYmwCjrzH2Mtwu_0Tfnf8p5kXno4bIVa8pAWSr2c2EX_kwzVkHir_v28iwi67EJnnyLjHTpl238qDrk3OUE79CWBveP2VrhIO7ufVKOhG1eaYiA553DvDAG8IGjghEGC7nnI2aCgYKAaQSARUSFQHGX2MimrAisgI1kHK6HmmTZvSNCw0175";
    //     assertEquals(linkAdapter.getGoogleCalendarEvents(access_token), linkImap.getImapEvents(access_token));
    // }
}