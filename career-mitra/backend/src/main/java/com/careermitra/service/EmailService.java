package com.careermitra.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service to handle email notifications
 */
@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        // Log to console first so it is always accessible locally
        logger.info("=========================================");
        logger.info("PASSWORD RESET REQUESTED");
        logger.info("To: {}", toEmail);
        logger.info("Reset Link: {}", resetLink);
        logger.info("=========================================");

        System.out.println("=========================================");
        System.out.println("PASSWORD RESET LINK GENERATED FOR: " + toEmail);
        System.out.println("Reset Link: " + resetLink);
        System.out.println("=========================================");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Career Mitra - Reset Your Password");
            message.setText("Hello,\n\nPlease click the link below to reset your password:\n" 
                            + resetLink + "\n\nRegards,\nCareer Mitra Team");
            mailSender.send(message);
            logger.info("Real SMTP email successfully sent to {}", toEmail);
        } catch (Exception e) {
            logger.warn("Could not send real email via SMTP (make sure SMTP credentials are set in application.properties): {}", e.getMessage());
        }
    }
}
