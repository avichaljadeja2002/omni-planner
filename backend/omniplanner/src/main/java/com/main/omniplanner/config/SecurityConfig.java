package com.main.omniplanner.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users/register").permitAll()
                        .requestMatchers("/api/users/login").permitAll()
                        .requestMatchers("/**").permitAll() 
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // Allow OPTIONS preflight
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .formLogin(Customizer.withDefaults())

                .sessionManagement(session -> session.sessionFixation().newSession())//protect against session fixation attacks

                //secure headers
                .headers(headers -> headers
                        .httpStrictTransportSecurity(hsts -> 
                            hsts.includeSubDomains(true).maxAgeInSeconds(31536000)  // Enforce HTTPS for 1 year
                        )
                        .addHeaderWriter(new ClearSiteDataHeaderWriter(
                            ClearSiteDataHeaderWriter.Directive.COOKIES,
                            ClearSiteDataHeaderWriter.Directive.STORAGE,
                            ClearSiteDataHeaderWriter.Directive.EXECUTION_CONTEXTS
                        ))
                        .addHeaderWriter((request, response) -> {
                            response.setHeader("Set-Cookie", "HttpOnly; Secure; SameSite=Strict");
                        })
                )

                .sessionManagement(session -> session
                        .invalidSessionUrl("/login")  // Redirect user when session is invalid
                        .maximumSessions(1)  // Only allow 1 active session per user
                        .expiredUrl("/login?expired=true")  // Redirect when session expires
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
