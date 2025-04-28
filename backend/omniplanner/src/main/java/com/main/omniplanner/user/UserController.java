package com.main.omniplanner.user;

import com.main.omniplanner.requests.ChangePasswordRequest;
import com.main.omniplanner.requests.LoginRequest;
import com.main.omniplanner.requests.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private AuditService auditService;

    // Track failed login attempts in memory
    private final ConcurrentHashMap<String, AtomicInteger> failedLoginAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> lockoutExpiry = new ConcurrentHashMap<>();

    private static final int MAX_ATTEMPTS = 3;
    private static final int LOCKOUT_DURATION_MINUTES = 15;

    // Check for locked account logic
    public boolean isAccountLocked(String username) {
        if (lockoutExpiry.containsKey(username)) {
            Instant lockoutTime = lockoutExpiry.get(username);
            if (Instant.now().isBefore(lockoutTime)) {
                return true; // Account is still locked
            } else {
                // Unlock the account after lockout period
                lockoutExpiry.remove(username);
                failedLoginAttempts.remove(username); // Reset attempts after unlock
            }
        }
        return false;
    }

    public void trackFailedAttempt(String username) {
        failedLoginAttempts.putIfAbsent(username, new AtomicInteger(0));
        int attempts = failedLoginAttempts.get(username).incrementAndGet();

        if (attempts >= MAX_ATTEMPTS) {
            auditService.logAccountEvent(username, "Account Locked");
            lockoutExpiry.put(username, Instant.now().plusSeconds(LOCKOUT_DURATION_MINUTES * 60));
        }
    }

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, UserService userService, AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.auditService = auditService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already taken");
        }

        if (!userService.isValidPassword(user.getPassword())) {
            return ResponseEntity.badRequest().body("Password must include at least one uppercase, one lowercase, one number, one special character, and be 8 characters long.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        userRepository.save(user);
        auditService.logAccountEvent(user.getUsername(), "Account Created");
        // Return only username and userId
        return ResponseEntity.ok(Map.of(
                "email", user.getUsername(),
                "name", "",
                "phone",  "",
                "age",  ""
        ));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = userOptional.get();

        // Block accounts after 3 failed attempts
        if(isAccountLocked(user.getUsername())) {
            return ResponseEntity.status(403).body("Account temporarily locked due to multiple failed attempts. Please try again later.");
        }

        if(user.isGoogleLogin())return ResponseEntity.status(401).body("Try Logging In With Google");
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            user.setToken(user.generateToken());
            userRepository.save(user);

            // Reset failed attempts on successful login
            failedLoginAttempts.remove(user.getUsername());
            auditService.logAccountEvent(user.getUsername(), "Login Successful");
            return ResponseEntity.ok(Map.of(
                    "token", user.getToken(),
                    "message", "Login successful",
                    "email", user.getUsername(),
                    "name", user.getName() != null ? user.getName() : "",
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "age", user.getAge() != null ? user.getAge() : ""

            ));
        } catch (BadCredentialsException ex) {
            trackFailedAttempt(user.getUsername());
            auditService.logAccountEvent(user.getUsername(), "Login Failed");
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String name = payload.get("name");

        Optional<User> existingUser = userRepository.findByUsername(email);

        User user;
        if (existingUser.isPresent()) {
            if (existingUser.get().isGoogleLogin()) {
                user = existingUser.get();
            } else {
                return ResponseEntity.badRequest().body("Email is already taken");
            }
        } else {
            user = new User();
            user.setUsername(email);
            user.setEnabled(true);
            user.setGoogleLogin(true);
            user.setPassword(null);
            user.setToken(user.generateToken());
            userRepository.save(user);

            auditService.logAccountEvent(user.getUsername(), "Google Account Linked");
        }

        return ResponseEntity.ok(Map.of(
                "token", user.getToken()
        ));
    }

    @PutMapping("/modify_user/{token}")
    public ResponseEntity<?> modifyUser(@PathVariable String token, @RequestBody UpdateUserRequest updateUser) {
        Integer userId = userRepository.getIdByToken(token);
        if (userId == null) {
            return ResponseEntity.status(401).body("Invalid token");
        }
        //handle new password
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (updateUser.getPassword() != null && !userService.isValidPassword(updateUser.getPassword())) {
            return ResponseEntity.badRequest().body("Password must include at least one uppercase, one lowercase, one number, one special character, and be 8 characters long.");
        }

        if (updateUser.getPassword() != null && !userService.isSignificantlyDifferent(user.getPassword(), updateUser.getPassword())) {
            return ResponseEntity.badRequest().body("New password must differ by at least 8 characters from the old password.");
        }

        userService.modifyUser(updateUser, userId);
        auditService.logAccountEvent(user.getUsername(), "User Modified");
        return ResponseEntity.ok("User modified successfully");
    }

    @PutMapping("/change_password/{token}")
    public ResponseEntity<?> changePassword(@PathVariable String token, @RequestBody ChangePasswordRequest changePasswordRequest) {
        Integer userId = userRepository.getIdByToken(token);
        if (userId == null) {
            return ResponseEntity.status(401).body("Invalid token");
        }
        return userService.changePassword(userId, changePasswordRequest.getOldPassword(),changePasswordRequest.getNewPassword());
    }
}