package com.main.omniplanner.user;

import com.main.omniplanner.requests.UpdateUserRequest;

import java.util.regex.Pattern;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.apache.commons.text.similarity.LevenshteinDistance;



@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AuditService auditService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AuditService auditService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("USER")
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();
    }

    public void modifyUser(UpdateUserRequest userRequest, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // Enforce password complexity check
        if (!isValidPassword(userRequest.getPassword())) {
            throw new IllegalArgumentException("Password must include at least one uppercase, one lowercase, one number, one special character, and be 8 characters long.");
        }

        // Enforce 8-character change rule
        if (!isSignificantlyDifferent(user.getPassword(), userRequest.getPassword())) {
            throw new IllegalArgumentException("New password must differ by at least 8 characters from the old password.");
        }

        

        user.setPassword(passwordEncoder.encode(userRequest.getPassword())); 
        user.setName(userRequest.getName());
        user.setPhone(userRequest.getPhone());
        user.setAge(userRequest.getAge());
        userRepository.save(user);
        // Log the modification
        auditService.logAccountEvent(user.getUsername(), "User Modified");
    }

    // Password Complexity Check
    public boolean isValidPassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$";
        return Pattern.compile(regex).matcher(password).matches();
    }

    // Enforce 8+ Character Change Rule
    public boolean isSignificantlyDifferent(String oldPassword, String newPassword) {
        LevenshteinDistance ld = new LevenshteinDistance();
        int distance = ld.apply(oldPassword, newPassword);
        return distance >= 8;
    }
}
