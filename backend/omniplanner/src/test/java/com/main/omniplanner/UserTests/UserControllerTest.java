package com.main.omniplanner.UserTests;

import com.main.omniplanner.requests.LoginRequest;
import com.main.omniplanner.requests.UpdateUserRequest;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserController;
import com.main.omniplanner.user.UserRepository;
import com.main.omniplanner.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    private LoginRequest loginRequest;
    private UserController userController;
    private User user;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        authenticationManager = mock(AuthenticationManager.class);
        userService = mock(UserService.class);
        userController = new UserController(userRepository, passwordEncoder, authenticationManager, userService);

        user = new User();
        user.setUsername("test_username");
        user.setPassword("test_password");
        user.setName(null);
        user.setPhone(null);
        user.setAge(null);

        loginRequest = new LoginRequest("test_username", "test_password");

    }

    @Test
    public void testRegisterUser_Success() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("test_password")).thenReturn("test_password_encoded");
        when(userRepository.save(user)).thenReturn(user);

        ResponseEntity<?> response = userController.registerUser(user);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Assert response body as a Map
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("test_username", responseBody.get("email"));
        assertEquals("", responseBody.get("name"));
        assertEquals("", responseBody.get("phone"));
        assertEquals("", responseBody.get("age"));
    }

    @Test
    public void testRegisterUser_Fail() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));
        ResponseEntity<?> response = userController.registerUser(user);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testLoginUser_Success() {
        User mockUser = mock(User.class);
        when(mockUser.getUsername()).thenReturn("test_username");
        when(mockUser.getPassword()).thenReturn("test_password");
        when(mockUser.getToken()).thenReturn("test_token");
        when(mockUser.getName()).thenReturn("test_name");
        when(mockUser.getPhone()).thenReturn("test_phone");
        when(mockUser.getAge()).thenReturn("test_age");
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(mockUser));
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.save(mockUser)).thenReturn(mockUser);

        ResponseEntity<?> response = userController.loginUser(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Assert response body as a Map
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("test_token", responseBody.get("token"));
        assertEquals("Login successful", responseBody.get("message"));
        assertEquals("test_username", responseBody.get("email"));
        assertEquals("test_name", responseBody.get("name"));
        assertEquals("test_phone", responseBody.get("phone"));
        assertEquals("test_age", responseBody.get("age"));
    }

    @Test
    public void testLoginUser_FailInvalid() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());
        ResponseEntity<?> response = userController.loginUser(loginRequest);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
    @Test
    public void testLoginUser_FailBCGoogle() {
        user.setGoogleLogin(true);
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));
        ResponseEntity<?> response = userController.loginUser(loginRequest);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    public void testLoginUser_FailBadCred() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));
        ResponseEntity<?> response = userController.loginUser(loginRequest);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    public void testGoogleLogin_Success_ExistingUserWithGoogleLogin() {
        // Arrange
        Map<String, String> payload = Map.of("email", "test_username", "name", "Test User");

        // Mock an existing user who has already logged in with Google
        User existingUser = new User();
        existingUser.setUsername("test_username");
        existingUser.setGoogleLogin(true);
        existingUser.setToken("existing_token");
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(existingUser));

        // Act
        ResponseEntity<?> response = userController.googleLogin(payload);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("existing_token", responseBody.get("token"));

        // Verify interactions
        verify(userRepository).findByUsername("test_username");
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void testGoogleLogin_Fail_UserExistsButNotWithGoogleLogin() {
        // Arrange
        Map<String, String> payload = Map.of("email", "test_username", "name", "Test User");

        // Mock an existing user who has not logged in with Google
        User existingUser = new User();
        existingUser.setUsername("test_username");
        existingUser.setGoogleLogin(false);  // Not a Google login user
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(existingUser));

        // Act
        ResponseEntity<?> response = userController.googleLogin(payload);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email is already taken", response.getBody());

        // Verify interactions
        verify(userRepository).findByUsername("test_username");
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void testGoogleLogin_Success_NewUser() {
        // Arrange
        Map<String, String> payload = Map.of("email", "test_username", "name", "Test User");

        // Mock the repository to return empty (new user)
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = userController.googleLogin(payload);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertTrue(responseBody.get("token").matches("[0-9a-fA-F-]{36}"));
    }



    @Test
    public void testModifyUser_Success() {
        UpdateUserRequest updateUser = new UpdateUserRequest("test_name", "test_phone", "test_age");
        User user2 = user;
        user2.setName("test_name");
        user2.setPhone("test_phone");
        user2.setAge("test_age");

        when(userRepository.getIdByToken("test_token")).thenReturn(1);

        ResponseEntity<?> response = userController.modifyUser("test_token", updateUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testModifyUser_Fail() {
        UpdateUserRequest updateUser = new UpdateUserRequest("test_name", "test_phone", "test_age");

        when(userRepository.getIdByToken("test_token")).thenReturn(null);

        ResponseEntity<?> response = userController.modifyUser("test_token", updateUser);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
