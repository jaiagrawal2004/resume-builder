package com.jai.resumebuilderapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    private final JavaMailSender mailSender;


    public void sendHtmlEmail(
            String to,
            String subject,
            String htmlContent
    ) throws MessagingException {

        log.info("Inside EmailService - sendHtmlEmail(): {}, {}", to, subject);

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }


    public void sendEmailWithAttachment(
            String to,
            String subject,
            String body,
            byte[] attachmentData,
            String filename
    ) throws MessagingException {

        log.info(
                "Inside EmailService - sendEmailWithAttachment(): {}, {}, {}",
                to, subject, filename
        );

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);

        helper.setText(body, true);

        // Add PDF attachment
        helper.addAttachment(
                filename,
                new ByteArrayDataSource(
                        attachmentData,
                        "application/pdf"
                )
        );

        mailSender.send(message);

        log.info("Email sent successfully to: {}", to);
    }
}