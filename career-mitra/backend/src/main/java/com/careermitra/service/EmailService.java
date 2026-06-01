package com.careermitra.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service to handle email notifications via HTTP API or SMTP
 */
@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.sender-email:no-reply@careermitra.com}")
    private String senderEmail;

    @Value("${app.mail.sendgrid-api-key:}")
    private String sendGridApiKey;

    @Value("${app.mail.brevo-api-key:}")
    private String brevoApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

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

        // Try SendGrid HTTP API if API key is provided
        if (sendGridApiKey != null && !sendGridApiKey.trim().isEmpty()) {
            if (sendSendGridEmail(toEmail, resetLink)) {
                return;
            }
        }

        // Try Brevo HTTP API if API key is provided
        if (brevoApiKey != null && !brevoApiKey.trim().isEmpty()) {
            if (sendBrevoEmail(toEmail, resetLink)) {
                return;
            }
        }

        // Fall back to SMTP mail sender if configured
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderEmail);
                message.setTo(toEmail);
                message.setSubject("Career Mitra - Reset Your Password");
                message.setText("Hello,\n\nPlease click the link below to reset your password:\n" 
                                + resetLink + "\n\nRegards,\nCareer Mitra Team");
                mailSender.send(message);
                logger.info("Real SMTP email successfully sent to {}", toEmail);
                return;
            } catch (Exception e) {
                logger.warn("Could not send email via SMTP: {}", e.getMessage());
            }
        }

        logger.info("No active email API key or SMTP configuration found. Link printed to console only.");
    }

    private boolean sendSendGridEmail(String toEmail, String resetLink) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + sendGridApiKey.trim());

            Map<String, Object> personalizations = new HashMap<>();
            personalizations.put("to", Collections.singletonList(Collections.singletonMap("email", toEmail)));

            Map<String, Object> from = new HashMap<>();
            from.put("email", senderEmail);
            from.put("name", "Career Mitra");

            Map<String, Object> content = new HashMap<>();
            content.put("type", "text/plain");
            content.put("value", "Hello,\n\nPlease click the link below to reset your password:\n" 
                                   + resetLink + "\n\nRegards,\nCareer Mitra Team");

            Map<String, Object> payload = new HashMap<>();
            payload.put("personalizations", Collections.singletonList(personalizations));
            payload.put("from", from);
            payload.put("subject", "Career Mitra - Reset Your Password");
            payload.put("content", Collections.singletonList(content));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.sendgrid.com/v3/mail/send", 
                request, 
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("SendGrid email successfully sent to {}", toEmail);
                return true;
            }
            logger.warn("SendGrid API returned status: {}", response.getStatusCode());
        } catch (Exception e) {
            logger.error("Failed to send email via SendGrid API: {}", e.getMessage());
        }
        return false;
    }

    private boolean sendBrevoEmail(String toEmail, String resetLink) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey.trim());

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", "Career Mitra");
            sender.put("email", senderEmail);

            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", sender);
            payload.put("to", Collections.singletonList(Collections.singletonMap("email", toEmail)));
            payload.put("subject", "Career Mitra - Reset Your Password");
            payload.put("textContent", "Hello,\n\nPlease click the link below to reset your password:\n" 
                                       + resetLink + "\n\nRegards,\nCareer Mitra Team");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.brevo.com/v3/smtp/email", 
                request, 
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Brevo email successfully sent to {}", toEmail);
                return true;
            }
            logger.warn("Brevo API returned status: {}", response.getStatusCode());
        } catch (Exception e) {
            logger.error("Failed to send email via Brevo API: {}", e.getMessage());
        }
        return false;
    }
}
