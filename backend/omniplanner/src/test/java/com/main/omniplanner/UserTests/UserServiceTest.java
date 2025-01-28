package com.main.omniplanner.UserTests;

import com.main.omniplanner.requests.UpdateUserRequest;
import com.main.omniplanner.user.User;
import com.main.omniplanner.user.UserRepository;
import com.main.omniplanner.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;  // Mocking the UserRepository

    @InjectMocks
    private UserService userService;  // Inject the mocked repository into the service

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);  // Initialize the mocks
        user = new User();
        user.setId(1);
        user.setUsername("test_username");
        user.setPassword("test_password");
        user.setEnabled(true);
    }

    // Test loadUserByUsername method
    @Test
    void testLoadUserByUsername_Success() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.of(user));  // Mocking the repository

        UserDetails userDetails = userService.loadUserByUsername("test_username");

        assertNotNull(userDetails);
        assertEquals("test_username", userDetails.getUsername());
        assertEquals("test_password", userDetails.getPassword());
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(userRepository.findByUsername("test_username")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("test_username"));
    }

    // Test modifyUser method
    @Test
    void testModifyUser_Success() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));  // Mocking the repository to return the user
        when(userRepository.save(user)).thenReturn(user);  // Mock save method

        userService.modifyUser(updateUserRequest, 1);

        assertEquals("new_name", user.getName());
        assertEquals("new_phone", user.getPhone());
        assertEquals("new_age", user.getAge());

        verify(userRepository).save(user);  // Verify that the save method was called
    }

    @Test
    void testModifyUser_UserNotFound() {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest("new_name", "new_phone", "new_age");

        when(userRepository.findById(1)).thenReturn(Optional.empty());  // Simulate that the user wasn't found

        assertThrows(RuntimeException.class, () -> userService.modifyUser(updateUserRequest, 1));  // Expecting a RuntimeException
    }
}
