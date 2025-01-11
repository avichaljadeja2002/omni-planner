package com.main.omniplanner.UserTests;

import com.main.omniplanner.user.PasswordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PasswordServiceTest {

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    private PasswordService passwordService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        passwordService = new PasswordService(passwordEncoder);
    }

    @Test
    public void testGenerateSaltLength() {
        String salt = passwordService.generateSalt();
        assertEquals(24, salt.length());
    }

    @Test
    public void testGenerateSaltUnique() {
        String salt1 = passwordService.generateSalt();
        String salt2 = passwordService.generateSalt();
        assertNotEquals(salt1, salt2);
    }

    @Test
    public void hashPasswordLength() {
        String password = "mySecurePassword";
        String salt = "randomSalt";

        String hashedPassword = "hashedPasswordExample";
        when(passwordEncoder.encode(password + salt)).thenReturn(hashedPassword);

        assertEquals(hashedPassword, passwordService.hashPassword(password, salt));
    }

    @Test
    public void hashPasswordNotSame() {
        String password = "mySecurePassword";
        String salt = "randomSalt";

        when(passwordEncoder.encode(password + salt)).thenReturn("hashedPassword1", "hashedPassword2");

        assertNotEquals(passwordService.hashPassword(password, salt), passwordService.hashPassword(password, salt));
    }

    @Test
    public void verifyPassword() {
        String password = "mySecurePassword";
        String salt = "randomSalt";
        String hashedPassword = "hashedPassword";

        when(passwordEncoder.matches(password + salt, hashedPassword)).thenReturn(true);

        assertTrue(passwordService.verifyPassword(password, salt, hashedPassword));

        verify(passwordEncoder).matches(password + salt, hashedPassword);
    }
}
