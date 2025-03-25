package com.main.omniplanner.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);

    public void logAccountEvent(String username, String event) {
        logger.info("Account Event - User: {} - Event: {}", username, event);
    }
}
