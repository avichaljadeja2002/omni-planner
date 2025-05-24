package com.main.omniplanner.LinkImap;

import com.main.omniplanner.calendar.LinkImap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class LinkImapRequestTest {
    @Test
    public void testLinkImap() {
        String token = "4034e083-7065-47d6-bfed-62eb5ba8a06e";
        String accessToken = "ya29.a0AW4XtxjEhBkK40ZBkqv-TSmgJ-Kmxiyib-9IYmwCjrzH2Mtwu_0Tfnf8p5kXno4bIVa8pAWSr2c2EX_kwzVkHir_v28iwi67EJnnyLjHTpl238qDrk3OUE79CWBveP2VrhIO7ufVKOhG1eaYiA553DvDAG8IGjghEGC7nnI2aCgYKAaQSARUSFQHGX2MimrAisgI1kHK6HmmTZvSNCw0175";
        const response = await call(`/link_imap/${token}`, 'POST', undefined, { accessToken: accessToken });

         String urlString = "http://localhost:8080/link_imap/" + token;
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
        conn.setRequestProperty("Content-Type", "application/json");

        // Send empty body or actual payload
        String body = "{}";  // or your actual JSON payload
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = body.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();
        assertEquals(200, responseCode); // Assuming 200 is the expected result
        assertEquals(response.status, 200);
        assertEquals(response.data, "imap linked successfully:Imap linked successfully for user ID: 19");
    }
        // assertEquals("imap linked successfully:Imap linked successfully for user ID: 19", 
        // linkImap(undefined, "4/0AUJR-x45Nr_xxrl42wDxKQslgfLlC3iECMcinK-7uN8q6vT9EdR7kBKkaP4PGcvB7drHdQ"));
}