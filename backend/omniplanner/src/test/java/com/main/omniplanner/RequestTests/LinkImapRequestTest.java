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
        String token = "ya29.a0AW4XtxjEhBkK40ZBkqv-TSmgJ-Kmxiyib-9IYmwCjrzH2Mtwu_0Tfnf8p5kXno4bIVa8pAWSr2c2EX_kwzVkHir_v28iwi67EJnnyLjHTpl238qDrk3OUE79CWBveP2VrhIO7ufVKOhG1eaYiA553DvDAG8IGjghEGC7nnI2aCgYKAaQSARUSFQHGX2MimrAisgI1kHK6HmmTZvSNCw0175";
        const response = await call(`/link_` + name + `/${token}`, 'POST', undefined, { accessToken: accessToken });
        assertEquals(response.status, 200);
        assertEquals(response.data, "imap linked successfully:Imap linked successfully for user ID: 19");
      }
        // assertEquals("imap linked successfully:Imap linked successfully for user ID: 19", 
        // linkImap(undefined, "4/0AUJR-x45Nr_xxrl42wDxKQslgfLlC3iECMcinK-7uN8q6vT9EdR7kBKkaP4PGcvB7drHdQ"));
    }
}

