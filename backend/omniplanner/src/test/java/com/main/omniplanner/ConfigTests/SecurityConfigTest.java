package com.main.omniplanner.ConfigTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void securityFilterChainBean_shouldNotBeNull() {
        assertNotNull(securityFilterChain);
    }

    @Test
    void passwordEncoder_shouldBeBCryptInstance() {
        assertNotNull(passwordEncoder);
        assertTrue(passwordEncoder.matches("secret", passwordEncoder.encode("secret")));
    }

    @Test
    void authenticationManager_shouldNotBeNull() {
        assertNotNull(authenticationManager);
    }

    @Test
    void corsConfiguration_shouldBeApplied() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.options("/")
                .header("Access-Control-Request-Method", "POST")
                .header("Origin", "http://localhost:8081"))
            .andExpect(status().isOk())
            .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

}
