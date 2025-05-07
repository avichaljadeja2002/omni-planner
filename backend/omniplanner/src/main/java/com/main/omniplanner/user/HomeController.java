package com.main.omniplanner.user;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.net.URLEncoder;
import org.json.JSONObject;

@RestController
@RequestMapping("/home")
public class HomeController {
    String credentialsFile = "C:\\Users\\norflewe\\OneDrive - Rose-Hulman Institute of Technology\\Documents\\Capstone\\omni-planner\\credentials.json";

    // public ActionResult Index()
    // {
    //     return View();
    // }

     @GetMapping("/oauth-redirect")
    public RedirectView OauthRedirect() {
        try {
            // Read credentials JSON
            String content = new String(Files.readAllBytes(Paths.get(credentialsFile)), StandardCharsets.UTF_8);
            JSONObject credentials = new JSONObject(content);

            // Build redirect URL
            String redirectUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" +
                    "?scope=" + URLEncoder.encode(credentials.getString("scope"), StandardCharsets.UTF_8) +
                    "&response_type=code" +
                    "&response_mode=query" +
                    "&state=enorfleet0" +
                    "&redirect_uri=" + URLEncoder.encode(credentials.getString("redirect_url"), StandardCharsets.UTF_8) +
                    "&client_id=" + URLEncoder.encode(credentials.getString("client_id"), StandardCharsets.UTF_8);

            return new RedirectView(redirectUrl);

        } catch (IOException e) {
            e.printStackTrace();
            // Redirect to an error page or handle as needed
            return new RedirectView("/error");
        }
    }
}
