package com.main.omniplanner.RequestTests;

import com.main.omniplanner.requests.ChangePasswordRequest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ChangePasswordRequestTest {

    @Test
    void testSetAndGetOldPassword() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("oldPass123");

        assertEquals("oldPass123", request.getOldPassword());
    }

    @Test
    void testSetAndGetNewPassword() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setNewPassword("newPass456");

        assertEquals("newPass456", request.getNewPassword());
    }

    @Test
    void testDefaultValues() {
        ChangePasswordRequest request = new ChangePasswordRequest();

        assertNull(request.getOldPassword());
        assertNull(request.getNewPassword());
    }
}
