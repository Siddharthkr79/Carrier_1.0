package com.careermitra.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service to handle email notifications
 */
@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        logger.info("=========================================");
        logger.info("PASSWORD RESET EMAIL SENT");
        logger.info("To: {}", toEmail);
        logger.info("Subject: Career Mitra - Reset Your Password");
        logger.info("Reset Link: {}", resetLink);
        logger.info("=========================================");
        
        // Output to console as well to make it stand out during local development
        System.out.println("=========================================");
        System.out.println("PASSWORD RESET EMAIL SENT TO: " + toEmail);
        System.out.println("Reset Link: " + resetLink);
        System.out.println("=========================================");
    }
}
