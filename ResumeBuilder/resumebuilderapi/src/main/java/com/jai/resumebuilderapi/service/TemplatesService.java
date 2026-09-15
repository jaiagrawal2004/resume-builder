package com.jai.resumebuilderapi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jai.resumebuilderapi.dto.AuthResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplatesService {

    private final AuthService authService;

    public Map<String, Object> getTemplates(Object principal) {

        AuthResponse authResponse = authService.getProfile(principal);

        List<String> availableTemplates;

        Boolean isPremiumUser = "PREMIUM".equalsIgnoreCase(authResponse.getSubscriptionPlan());

        if (isPremiumUser) {
            availableTemplates = List.of("01", "02", "03");
        } else {
                availableTemplates = List.of("01");
        }

        Map<String, Object> restrictions =new HashMap<>();

        restrictions.put("availableTemplates",availableTemplates);

        restrictions.put("allTemplates", List.of("01", "02", "03"));

        restrictions.put("subscriptionPlan",authResponse.getSubscriptionPlan());

        restrictions.put("isPremiumUser",isPremiumUser);

        return restrictions;
    }
}