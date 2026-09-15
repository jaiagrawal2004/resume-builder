package com.jai.resumebuilderapi.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jai.resumebuilderapi.service.EmailService;

import jakarta.mail.MessagingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    @PostMapping(
            value = "/send-resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, Object>> sendResumeByEmail(
            @RequestPart("recipientEmail") String recipientEmail,
            @RequestPart(value = "subject", required = false) String subject,
            @RequestPart(value = "message", required = false) String message,
            @RequestPart("pdfFile") MultipartFile pdfFile,
            Authentication authentication
    ) throws IOException, MessagingException {

        log.info("Sending resume to: {}", recipientEmail);

        Map<String, Object> response = new HashMap<>();

        if (Objects.isNull(recipientEmail)
                || recipientEmail.isBlank()
                || Objects.isNull(pdfFile)
                || pdfFile.isEmpty()) {

            response.put("success", false);
            response.put("message", "Missing required parameters");

            return ResponseEntity.badRequest().body(response);
        }

        byte[] pdfBytes = pdfFile.getBytes();

        String originalFilename = pdfFile.getOriginalFilename();

        String filename = Objects.nonNull(originalFilename)
                ? originalFilename
                : "resume.pdf";

        String emailSubject = Objects.nonNull(subject) && !subject.isBlank()
                ? subject
                : "Resume Application";

        String emailBody = Objects.nonNull(message) && !message.isBlank()
                ? message
                : "Please find my attached resume.\n\nBest regards.";

        emailService.sendEmailWithAttachment(
                recipientEmail,
                emailSubject,
                emailBody,
                pdfBytes,
                filename
        );

        response.put("success", true);
        response.put("message", "Resume sent successfully to " + recipientEmail);

        return ResponseEntity.ok(response);
    }
}