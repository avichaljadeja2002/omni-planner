package com.main.omniplanner.user;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.util.MultiValueMap;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import org.json.JSONObject;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/oauth")
public class OauthController {
    String credentialsFile = "C:\\Users\\norflewe\\OneDrive - Rose-Hulman Institute of Technology\\Documents\\Capstone\\omni-planner\\credentials.json";
    String tokensFile = "C:\\Users\\norflewe\\OneDrive - Rose-Hulman Institute of Technology\\Documents\\Capstone\\omni-planner\\tokens.json";

    @GetMapping("/callback")
    public RedirectView Callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error) {

        try {
            // Load credentials from file
            String content = new String(Files.readAllBytes(Paths.get(credentialsFile)), StandardCharsets.UTF_8);
            JSONObject credentials = new JSONObject(content);

            if (code != null && !code.isBlank()) {
                RestTemplate restTemplate = new RestTemplate();

                // Prepare request body
                MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
                requestBody.add("client_id", credentials.getString("client_id"));
                requestBody.add("scope", credentials.getString("scopes"));
                requestBody.add("redirect_uri", credentials.getString("redirect_url"));
                requestBody.add("code", code);
                requestBody.add("grant_type", "authorization_code");
                requestBody.add("client_secret", credentials.getString("client_secret"));

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);

                ResponseEntity<String> response = restTemplate.postForEntity(
                        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
                        request,
                        String.class
                );

                if (response.getStatusCode() == HttpStatus.OK) {
                    Files.write(Paths.get(tokensFile), response.getBody().getBytes(StandardCharsets.UTF_8));
                    return new RedirectView("/home"); // Similar to RedirectToAction("Index", "Home")
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new RedirectView("/error"); // Similar to RedirectToAction("Error")
    }
}