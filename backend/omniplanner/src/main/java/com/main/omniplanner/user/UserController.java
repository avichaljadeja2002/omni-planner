package com.main.omniplanner.user;

        import org.springframework.http.ResponseEntity;
        import org.springframework.security.authentication.AuthenticationManager;
        import org.springframework.security.authentication.BadCredentialsException;
        import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
        import org.springframework.security.core.Authentication;
        import org.springframework.security.core.context.SecurityContextHolder;
        import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        // Return only username and userId
        return ResponseEntity.ok(Map.of(
                "username", savedUser.getUsername(),
                "userId", savedUser.getId()
        ));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "userId", user.getId()
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
            user = existingUser.get();
        } else {
            user = new User();
            user.setUsername(email);
            user.setEnabled(true);
            user.setGoogleLogin(true);
            user.setPassword(null);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId()
        ));
    }

}



