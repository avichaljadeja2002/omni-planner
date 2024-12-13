package com.main.omniplanner.notifications;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;
@RestController
@CrossOrigin
public class NotificationController {
    public static void sendPushNotification(String expoPushToken, String title, String message) {
        try {
            URL url = new URL("https://exp.host/--/api/v2/push/send");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

            JSONObject notification = new JSONObject();
            notification.put("to", expoPushToken);
            notification.put("sound", "default");
            notification.put("title", title);
            notification.put("body", message);
            notification.put("data", new JSONObject().put("extraData", "Some custom data"));

            OutputStream os = conn.getOutputStream();
            os.write(notification.toString().getBytes("UTF-8"));
            os.close();

            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                System.out.println("Notification sent successfully.");
            } else {
                System.out.println("Failed to send notification. Response Code: " + responseCode);
            }

            conn.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("An error occurred while sending the notification.");
        }
    }
}


