package com.main.omniplanner.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PasswordService {

    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public PasswordService(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public String hashPassword(String password, String salt) {
        return passwordEncoder.encode(password + salt);
    }

    public boolean verifyPassword(String password, String salt, String hashedPassword) {
        return passwordEncoder.matches(password + salt, hashedPassword);
    }
}
