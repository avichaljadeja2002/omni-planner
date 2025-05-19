package com.main.omniplanner.UserTests;

import com.main.omniplanner.requests.UpdateUserRequest;
import com.main.omniplanner.user.AuditService;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import com.main.omniplanner.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserRepository userRepository;  // Mocking the UserRepository

    private AuditService auditService;

    private PasswordEncoder passwordEncoder;

    private UserService userService;  // Inject the mocked repository into the service

    private User user;

    @BeforeEach
    void setUp() {
        auditService = mock(AuditService.class);  // Mock the audit service
        passwordEncoder = mock(PasswordEncoder.class);  // Mock the password encoder
        userRepository = mock(UserRepository.class);  // Mock the repository
        userService = new UserService(userRepository, auditService, passwordEncoder);  // Initialize the service
        MockitoAnnotations.openMocks(this);  // Initialize the mocks
        user = new User();
        user.setId(1);
        user.setUsername("test_username");
        user.setPassword("Test_password1@");
        user.setEnabled(true);
    }

    // Test loadUserByUsername method
    @Test
    void testLoadUserByUsername_Success() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));  // Mocking the repository

        UserDetails userDetails = userService.loadUserByUsername("test_username");

        assertNotNull(userDetails);
        assertEquals("test_username", userDetails.getUsername());
        assertEquals("Test_password1@", userDetails.getPassword());
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("test_username"));
    }

    @Test
    void testLoadUserByUsername_DisabledUser() {
        user.setEnabled(false);  // Simulate a disabled user
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));

        UserDetails userDetails = userService.loadUserByUsername("test_username");

        assertFalse(userDetails.isEnabled());  // Ensure the user is marked as disabled
    }

    // Test modifyUser method
    @Test
    void testModifyUser_Success() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age", "Test_significantly_different_password1@");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));  // Mocking the repository to return the user
        when(userRepository.save(user)).thenReturn(user);  // Mock save method

        userService.modifyUser(updateUserRequest, 1);

        assertEquals("new_name", user.getName());
        assertEquals("new_phone", user.getPhone());
        assertEquals("new_age", user.getAge());

        verify(userRepository).save(user);  // Verify that the save method was called
    }

    @Test
    void testModifyUser_NotValidPassword() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age", "T");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));  // Simulate that the user wasn't found

        assertThrows(IllegalArgumentException.class, () -> userService.modifyUser(updateUserRequest, 1));  // Expecting a RuntimeException
    }
    @Test
    void testModifyUser_UserNotFound() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age", "Test_password1@");

        when(userRepository.findById(1)).thenReturn(Optional.empty());  // Simulate that the user wasn't found

        assertThrows(RuntimeException.class, () -> userService.modifyUser(updateUserRequest, 1));  // Expecting a RuntimeException
    }
    @Test
    void testModifyUser_NotSigDiff() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age", "Test_password2@");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));  // Simulate that the user wasn't found

        assertThrows(IllegalArgumentException.class, () -> userService.modifyUser(updateUserRequest, 1));  // Expecting a RuntimeException
    }

    @Test
    public void testChangePassword_UserNotFound() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "newPass123!";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("User not found", response.getBody());
    }

    @Test
    public void testChangePassword_Within24Hours() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "newPass123!";

        User user = new User();
        user.setPassword(passwordEncoder.encode("Test_password1@"));
        user.setLastPasswordUpdate(new Timestamp(System.currentTimeMillis() - (23 * 60 * 60 * 1000)));  // 23 hours ago

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Password can only be changed once every 24 hours", response.getBody());
    }

    @Test
    public void testChangePassword_IncorrectOldPassword() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "newPass123!";

        User user = new User();
        user.setPassword(passwordEncoder.encode("Test_password1@1"));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Incorrect old password", response.getBody());
    }

    @Test
    public void testChangePassword_NewPasswordTooShort() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "short!";

        User user = new User();
        user.setPassword(passwordEncoder.encode("Test_password1@"));
        when(passwordEncoder.matches(oldPassword, user.getPassword())).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("New password must be at least 15 characters long", response.getBody());
    }

    @Test
    public void testChangePassword_PasswordTooSimilar() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "Test_password2@";

        User user = new User();
        user.setPassword("Test_password1@");
        when(passwordEncoder.matches(oldPassword, user.getPassword())).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("New password must have at least 8 different characters from the old password", response.getBody());
    }

    @Test
    public void testChangePassword_InvalidPasswordFormat() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "password1231111";  // Invalid password format

        User user = new User();
        user.setPassword(oldPassword);

        when(passwordEncoder.matches(oldPassword, user.getPassword())).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Ensure oldPassword and newPassword are not null before calling changePassword
        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Password must include at least one uppercase, one lowercase, one number, one special character, and be 8 characters long.", response.getBody());
    }

    @Test
    public void testChangePassword_Success() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "NewPassword123!";

        User user = new User();
        user.setPassword("Test_password1@");
        user.setPreviousPasswords(new ArrayList<>());
        when(passwordEncoder.matches(oldPassword, user.getPassword())).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);
        System.out.println(response.getBody());
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Password changed successfully", response.getBody());
    }



}
