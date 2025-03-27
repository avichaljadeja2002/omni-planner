package com.main.omniplanner.ConfigTests;

import com.main.omniplanner.config.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void testHandleGeneralException() {
        Exception exception = new Exception("Some internal error");
        ResponseEntity<String> response = exceptionHandler.handleGeneralException(exception);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred. Please try again later.", response.getBody());
    }

    @Test
    void testHandleBadRequest() {
        IllegalArgumentException exception = new IllegalArgumentException("Invalid input provided");
        ResponseEntity<String> response = exceptionHandler.handleBadRequest(exception);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid input provided", response.getBody());
    }

    @Test
    void testHandleBadCredentials() {
        BadCredentialsException exception = new BadCredentialsException("Wrong password");
        ResponseEntity<String> response = exceptionHandler.handleBadCredentials(exception);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid username or password.", response.getBody());
    }
}
