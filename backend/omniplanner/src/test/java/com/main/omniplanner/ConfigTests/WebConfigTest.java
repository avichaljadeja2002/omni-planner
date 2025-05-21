package com.main.omniplanner.ConfigTests;

import com.main.omniplanner.config.WebConfig;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class WebConfigTest {

    @Test
    void corsConfigurer_shouldReturnNonNull() {
        WebConfig webConfig = new WebConfig();
        WebMvcConfigurer configurer = webConfig.corsConfigurer();
        assertNotNull(configurer, "CORS configurer should not be null");
    }

    @Test
    void corsConfigurer_shouldApplyCorrectSettings() {
        // Setup
        WebConfig webConfig = new WebConfig();
        WebMvcConfigurer configurer = webConfig.corsConfigurer();
        
        // Mock registry and registration
        CorsRegistry registry = mock(CorsRegistry.class);
        CorsRegistration registration = mock(CorsRegistration.class);
        
        // Use proper varargs matching
        when(registry.addMapping(anyString())).thenReturn(registration);
        when(registration.allowedOrigins(any(String[].class))).thenReturn(registration);
        when(registration.allowedMethods(any(String[].class))).thenReturn(registration);
        when(registration.allowedHeaders(any(String[].class))).thenReturn(registration);
        when(registration.allowCredentials(anyBoolean())).thenReturn(registration);

        // Execute
        configurer.addCorsMappings(registry);

        // Verify
        verify(registry).addMapping("/**");
        
        // Verify with array arguments for varags parameters
        verify(registration).allowedOrigins(new String[] {"http://localhost:8081"});
        verify(registration).allowedMethods(new String[] {"GET", "POST", "PUT", "DELETE", "OPTIONS"});
        verify(registration).allowedHeaders(new String[] {"*"});
        verify(registration).allowCredentials(true);
    }

}
