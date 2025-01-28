package com.main.omniplanner.RequestTests;

import com.main.omniplanner.requests.UpdateUserRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UpdateUserRequestTest {
    @InjectMocks
    private UpdateUserRequest updateUserRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetSetName() {
        String name = "abcdef123456";

        updateUserRequest.setName(name);  // Set name
        assertEquals(name, updateUserRequest.getName());  // Assert that getName returns the same value}
    }
    @Test
    public void testGetSetPhone(){
        String phone = "abcdef123456";

        updateUserRequest.setPhone(phone);  // Set phone
        assertEquals(phone, updateUserRequest.getPhone());  // Assert that getPhone returns the same value
    }

    @Test
    public void testGetSetAge(){
        String age = "abcdef123456";

        updateUserRequest.setAge(age);  // Set age
        assertEquals(age, updateUserRequest.getAge());  // Assert that getAge returns the same value
    }
}

