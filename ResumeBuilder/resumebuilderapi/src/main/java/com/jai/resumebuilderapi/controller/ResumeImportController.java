package com.jai.resumebuilderapi.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jai.resumebuilderapi.service.ResumeImportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeImportController {

    private final ResumeImportService resumeImportService;

    // ================= IMPORT RESUME =================

    @PostMapping("/import")
    public ResponseEntity<?> importResume(
            @RequestPart("file") MultipartFile file) {

        try {

            String extractedText =
                    resumeImportService.extractText(file);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "fileName",
                            file.getOriginalFilename(),
                            "text",
                            extractedText
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (IOException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Unable to read the resume file."
                            )
                    );
        }
    }
}