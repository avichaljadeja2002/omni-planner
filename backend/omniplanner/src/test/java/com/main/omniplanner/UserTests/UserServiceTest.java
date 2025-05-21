package com.main.omniplanner.UserTests;

import com.main.omniplanner.requests.UpdateUserRequest;
import com.main.omniplanner.user.AuditService;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import com.main.omniplanner.user.UserService;
import jakarta.persistence.EntityNotFoundException;
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

    private UserRepository userRepository;

    private AuditService auditService;

    private PasswordEncoder passwordEncoder;

    private UserService userService;

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
        user.setName("old_name");
        user.setPhone("old_phone");
        user.setAge("25");
        user.setEnabled(true);
    }

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
        user.setEnabled(false);
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));

        UserDetails userDetails = userService.loadUserByUsername("test_username");

        assertFalse(userDetails.isEnabled());
    }

    // Test modifyUser method
    @Test
    void testModifyUser_Success() {
        UpdateUserRequest request = new UpdateUserRequest("new_name", "new_phone", "30", "ValidPass123!");
        
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);
        
        userService.modifyUser(request, 1);
        
        assertEquals("new_name", user.getName());
        assertEquals("new_phone", user.getPhone());
        assertEquals("30", user.getAge());
        assertEquals("encodedPass", user.getPassword());
        
        verify(auditService).logAccountEvent(user.getUsername(), "User Modified");
        verify(userRepository).save(user);
    }

    @Test
    void testModifyUser_PartialUpdate() {
        UpdateUserRequest request = new UpdateUserRequest("partial_name", null, user.getAge(), null);
        
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        
        userService.modifyUser(request, 1);
        
        assertEquals("partial_name", user.getName());
        // Add explicit type checks
        assertTrue(user.getAge() instanceof String, "Age should remain String type");
        assertEquals("25", user.getAge());
        verify(userRepository).save(user);
    }

    @Test
    void testModifyUser_NotValidPassword() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age", "T");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> userService.modifyUser(updateUserRequest, 1));
    }
    @Test
    void testModifyUser_UserNotFound() {
        UpdateUserRequest request = new UpdateUserRequest(null, null, null, "ValidPass123!");
        when(userRepository.findById(anyInt())).thenReturn(Optional.empty());
        
        assertThrows(EntityNotFoundException.class,
            () -> userService.modifyUser(request, 1));
    }
    @Test
    void testModifyUser_NotSigDiff() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age", "Test_password2@");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> userService.modifyUser(updateUserRequest, 1));
    }

    @Test
    void testModifyUser_EmptyPassword() {
        UpdateUserRequest request = new UpdateUserRequest(null, null, null, "");
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        
        assertThrows(IllegalArgumentException.class,
            () -> userService.modifyUser(request, 1));
    }

    @Test
    void testModifyUser_PasswordUpdate() {
        // Setup
        User realUser = new User();  // Use real object instead of mock
        realUser.setPassword("originalEncodedPass");
        
        UpdateUserRequest request = new UpdateUserRequest(null, null, null, "ValidPass123!");
        
        when(userRepository.findById(1)).thenReturn(Optional.of(realUser));
        when(passwordEncoder.encode("ValidPass123!")).thenReturn("newEncodedPass");
        
        // Execute
        userService.modifyUser(request, 1);
        
        // Verify
        assertEquals("newEncodedPass", realUser.getPassword(), "Password should be updated");
        verify(userRepository).save(realUser);
        verify(auditService).logAccountEvent(realUser.getUsername(), "User Modified");
        
        // Verify other fields not set
        assertNull(realUser.getName());
        assertNull(realUser.getPhone());
        assertNull(realUser.getAge());
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
        user.setLastPasswordUpdate(new Timestamp(System.currentTimeMillis() - (23 * 60 * 60 * 1000)));

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
        String newPassword = "password1231111";

        User user = new User();
        user.setPassword(oldPassword);

        when(passwordEncoder.matches(oldPassword, user.getPassword())).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userService.changePassword(userId, oldPassword, newPassword);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Password must include at least one uppercase, one lowercase, one number, one special character, and be 8 characters long.", response.getBody());
    }

    @Test
    public void testChangePassword_Success() {
        Integer userId = 1;
        String oldPassword = "Test_password1@";
        String newPassword = "NewPassword123!123123";

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

@Test
    public void testLevenshteinBoundaryConditions() {
        String basePassword = "Aa1!Bb2@Cc3#Dd"; // 14 characters
        
        String password4 = "Xa1!Xb2@Xc3#Xd"; // 4 changes (actual distance 4)
        String exact6 = "Xa1!Xb2@Xc3#XXX"; // 6 changes (actual distance 6)
        String exact8 = "XX1!XX2@XX3#XX"; // 8 changes (actual distance 8)
        String exact9 = "XX1!XX2@XX3#XXX"; // 9 changes (actual distance 8)

        assertFalse(userService.isSignificantlyDifferent(basePassword, password4),
            "4-character difference should be too similar");
        
        assertFalse(userService.isSignificantlyDifferent(basePassword, exact6),
            "6-character difference should pass");
        
        assertTrue(userService.isSignificantlyDifferent(basePassword, exact8),
            "8-character difference should pass");

        assertTrue(userService.isSignificantlyDifferent(basePassword, exact9),
            "9-character difference should pass");
    }

}
