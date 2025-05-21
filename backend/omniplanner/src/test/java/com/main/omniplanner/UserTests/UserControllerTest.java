package com.main.omniplanner.UserTests;

import com.main.omniplanner.requests.ChangePasswordRequest;
import com.main.omniplanner.requests.LoginRequest;
import com.main.omniplanner.requests.UpdateUserRequest;
import com.main.omniplanner.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

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

    @Autowired
    private AuditService auditService;

    private LoginRequest loginRequest;
    private UserController userController;
    private User user;

    private final Map<String, Instant> lockoutExpiry = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> failedLoginAttempts = new ConcurrentHashMap<>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        authenticationManager = mock(AuthenticationManager.class);
        userService = mock(UserService.class);
        auditService = mock(AuditService.class);
        userController = new UserController(userRepository, passwordEncoder, authenticationManager, userService, auditService);

        user = new User();
        user.setUsername("test_username");
        user.setPassword("Test_password1@");
        user.setName(null);
        user.setPhone(null);
        user.setAge(null);

        loginRequest = new LoginRequest("test_username", "Test_password1@");

    }

    @Test
    public void testRegisterUser_Success() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Test_password1@")).thenReturn("test_password_encoded");
        when(userRepository.save(user)).thenReturn(user);
        when(userService.isValidPassword("Test_password1@")).thenReturn(true);

        ResponseEntity<?> response = userController.registerUser(user);
        System.out.println(user.getPassword());
        System.out.println(response);
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
        UpdateUserRequest updateUser = new UpdateUserRequest("test_name", "test_phone", "test_age", "Test_password1@");
        User user2 = user;
        user2.setName("test_name");
        user2.setPhone("test_phone");
        user2.setAge("test_age");

        when(userRepository.getIdByToken("test_token")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userService.isValidPassword("Test_password1@")).thenReturn(true);
        when(userService.isSignificantlyDifferent(user.getPassword(), "Test_password1@")).thenReturn(true);

        ResponseEntity<?> response = userController.modifyUser("test_token", updateUser);
        System.out.println(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testModifyUser_Fail() {
        UpdateUserRequest updateUser = new UpdateUserRequest("test_name", "test_phone", "test_age", "Test_password1@");

        when(userRepository.getIdByToken("test_token")).thenReturn(null);

        ResponseEntity<?> response = userController.modifyUser("test_token", updateUser);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    public void testIsAccountLocked_NoLockoutRecord() {
        String username = "new_user";
        boolean result = userController.isAccountLocked(username);
        assertFalse(result, "Account should not be locked as no lockout record exists");
    }

    @Test
    public void testChangePassword_Success() {
        String token = "valid_token";
        Integer userId = 1;
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("oldPass123");
        request.setNewPassword("newPass456");

        when(userRepository.getIdByToken(token)).thenReturn(userId);
        when(userService.changePassword(userId, "oldPass123", "newPass456")).thenReturn((ResponseEntity) ResponseEntity.ok("Password changed successfully"));
        ResponseEntity<?> response = userController.changePassword(token, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password changed successfully", response.getBody());
    }

    @Test
    public void testChangePassword_InvalidToken() {
        String token = "invalid_token";
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("oldPass123");
        request.setNewPassword("newPass456");

        when(userRepository.getIdByToken(token)).thenReturn(null);

        ResponseEntity<?> response = userController.changePassword(token, request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid token", response.getBody());
    }
    
    @Test
    public void testAccountUnlock_AfterLockoutExpires() {
        // Simulate lockout expiry
        String username = "test_username";
        // Directly manipulate lockoutExpiry map for test
        userController.lockoutExpiry.put(username, Instant.now().minusSeconds(60));
        assertFalse(userController.isAccountLocked(username));
    }
    @Test
    public void testRegisterUser_InvalidPassword() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());
        when(userService.isValidPassword("Test_password1@")).thenReturn(false);

        ResponseEntity<?> response = userController.registerUser(user);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(
            "Password must include at least one uppercase, one lowercase, one number, one special character, and be 8 characters long.",
            response.getBody()
        );
    }

    @Test
    public void testRegisterUser_VerifiesPasswordAndEnabledAndAudit() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Test_password1@")).thenReturn("encoded_pass");
        when(userService.isValidPassword("Test_password1@")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User spyUser = spy(user);

        userController.registerUser(spyUser);

        verify(spyUser).setPassword("encoded_pass");
        verify(spyUser).setEnabled(true);
        verify(auditService).logAccountEvent(eq("test_username"), eq("Account Created"));
    }
    @Test
    public void testLoginUser_AccountLocked() {
        // Simulate account locked
        userController.lockoutExpiry.put("test_username", Instant.now().plusSeconds(900));
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));
        ResponseEntity<?> response = userController.loginUser(loginRequest);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("locked"));
    }
    @Test
    public void testLoginUser_FailBadCred_TracksAttemptAndAudits() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        UserController spyController = spy(userController);
        doNothing().when(spyController).trackFailedAttempt(anyString());

        ResponseEntity<?> response = spyController.loginUser(loginRequest);

        verify(spyController).trackFailedAttempt("test_username");
        verify(auditService).logAccountEvent(eq("test_username"), eq("Login Failed"));
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
    @Test
    public void testModifyUser_PasswordValidationFailure() {
        UpdateUserRequest updateUser = new UpdateUserRequest("test_name", "test_phone", "test_age", "badpass");
        when(userRepository.getIdByToken("test_token")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userService.isValidPassword("badpass")).thenReturn(false);

        ResponseEntity<?> response = userController.modifyUser("test_token", updateUser);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(
            "Password must include at least one uppercase, one lowercase, one number, one special character, and be 8 characters long.",
            response.getBody()
        );
    }

    @Test
    public void testModifyUser_VerifiesServiceAndAudit() {
        UpdateUserRequest updateUser = new UpdateUserRequest("test_name", "test_phone", "test_age", null);
        when(userRepository.getIdByToken("test_token")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userController.modifyUser("test_token", updateUser);

        verify(userService).modifyUser(updateUser, 1);
        verify(auditService).logAccountEvent(eq("test_username"), eq("User Modified"));
    }

}
