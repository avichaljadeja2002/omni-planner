package com.main.omniplanner.user;

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

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        userRepository.save(user);

        // Return only username and userId
        return ResponseEntity.ok(Map.of(
                "email", user.getUsername(),
                "name", user.getName() != null ? user.getName() : "",
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "age", user.getAge() != null ? user.getAge() : ""
        ));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = userOptional.get();

        if(user.isGoogleLogin())return ResponseEntity.status(401).body("Try Logging In a Different Way");
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            user.setToken(user.generateToken());
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "token", user.getToken(),
                    "message", "Login successful",
                    "email", user.getUsername(),
                    "name", user.getName() != null ? user.getName() : "",
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "age", user.getAge() != null ? user.getAge() : ""

            ));
        } catch (BadCredentialsException ex) {
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
        userService.modifyUser(updateUser, userId);
        return ResponseEntity.ok("User modified successfully");
    }


}



