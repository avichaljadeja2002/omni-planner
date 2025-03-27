package com.main.omniplanner.user;

import com.main.omniplanner.requests.UpdateUserRequest;
import org.springframework.http.ResponseEntity;

import java.util.regex.Pattern;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.apache.commons.text.similarity.LevenshteinDistance;



@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AuditService auditService;
    private final PasswordEncoder passwordEncoder;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuditService auditService, PasswordEncoder passwordEncoder) {
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

    public ResponseEntity<?>  changePassword(Integer userId, String oldPassword, String newPassword){
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOptional.get();

        if (user.getLastPasswordUpdate() != null) {
            Timestamp twentyFourHoursAgo = new Timestamp(System.currentTimeMillis() - (24 * 60 * 60 * 1000));
            if (user.getLastPasswordUpdate().after(twentyFourHoursAgo)) {
                return ResponseEntity.badRequest().body("Password can only be changed once every 24 hours");
            }
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect old password");
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest().body("New password must be at least 8 characters long");
        }

        int diffCount = 0;
        for (int i = 0; i < Math.max(oldPassword.length(), newPassword.length()); i++) {
            if (i >= oldPassword.length() || i >= newPassword.length() ||
                    oldPassword.charAt(i) != newPassword.charAt(i)) {
                diffCount++;
            }
        }
        if (diffCount < 8) {
            return ResponseEntity.badRequest().body("New password must have at least 8 different characters from the old password");
        }

        if (user.getPreviousPasswords().contains(passwordEncoder.encode(oldPassword))) {
            return ResponseEntity.badRequest().body("Password cannot be reused");
        }

        user.getPreviousPasswords().add(passwordEncoder.encode(user.getPassword()));
        if (user.getPreviousPasswords().size() > 5) {
            user.getPreviousPasswords().remove(0); // Keep only the last 5
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setLastPasswordUpdate(new Timestamp(System.currentTimeMillis()));
        
        auditService.logAccountEvent(user.getUsername(), "Password Changed");
        return ResponseEntity.ok("Password changed successfully");
    }
}
