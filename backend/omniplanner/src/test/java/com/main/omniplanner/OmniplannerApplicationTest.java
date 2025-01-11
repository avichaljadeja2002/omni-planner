package com.main.omniplanner;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class OmniplannerApplicationTest {

    @Test
    void contextLoads() {
        // This test will pass if the application context loads successfully.
    }

    @Test
    void testMainMethod() {
        // Test the main method explicitly
        assertDoesNotThrow(() -> OmniplannerApplication.main(new String[]{}));
    }
}
