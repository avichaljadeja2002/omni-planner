package com.main.omniplanner.calendar;

import com.main.omniplanner.calendar.LinkGoogleCalendar;
import com.main.omniplanner.calendar.LinkImap;
import com.main.omniplanner.requests.CalendarLinkRequest;
import java.util.List;
import com.main.omniplanner.user.GenericEvent;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.IOException;
import java.net.http.HttpResponse;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpClient;

public class LinkAdapter extends LinkGoogleCalendar {

    private LinkImap linkImap = new LinkImap();

    @Override
    public String linkCalendar(@RequestBody CalendarLinkRequest request, @PathVariable String token) {
        String accessToken = request.getAccessToken();

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:8080/link_imap/" + token))
            .header("Authorization", "Bearer " + accessToken)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{}"))
            .build();

        HttpResponse<String> response = null;

        try {
            response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            System.out.println(response.statusCode());
            System.out.println(response.body());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        return response.body();
    }

    @Override
    public List<GenericEvent> getGoogleCalendarEvents(@RequestParam String access_token) {
        return linkImap.getImapEvents(access_token);
    }
};