package com.jai.resumebuilderapi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jai.resumebuilderapi.service.TemplatesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplatesController {

    private final TemplatesService templatesService;

    @GetMapping
    public ResponseEntity<?> getTemplates(
            Authentication authentication) {

        Map<String, Object> response =
                templatesService.getTemplates(
                        authentication.getPrincipal()
                );

        return ResponseEntity.ok(response);
    }
}