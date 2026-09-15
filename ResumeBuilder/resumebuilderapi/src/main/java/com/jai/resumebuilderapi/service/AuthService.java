package com.jai.resumebuilderapi.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jai.resumebuilderapi.document.User;
import com.jai.resumebuilderapi.dto.AuthResponse;
import com.jai.resumebuilderapi.dto.LoginRequest;
import com.jai.resumebuilderapi.dto.RegisterRequest;
import com.jai.resumebuilderapi.exception.ResourceExistsException;
import com.jai.resumebuilderapi.repository.UserRepository;
import com.jai.resumebuilderapi.util.JwtUtil;

@Service
public class AuthService {

    private static final Logger log =
            LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // =====================================================
    // BACKEND URL
    // =====================================================

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    // =====================================================
    // FRONTEND URL
    // =====================================================

    @Value("${app.frontend.url:http://127.0.0.1:56979/frontend}")
    private String frontendUrl;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AuthService(
            UserRepository userRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // =====================================================
    // REGISTER
    // =====================================================

    public AuthResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        log.info(
                "Inside AuthService - register(): {}",
                email
        );

        if (userRepository.existsByEmail(email)) {

            throw new ResourceExistsException(
                    "User already exists with this email."
            );
        }

        User newUser =
                toDocument(request, email);

        User savedUser =
                userRepository.save(newUser);

        sendVerificationEmail(savedUser);

        return toResponse(savedUser);
    }

    // =====================================================
    // SEND VERIFICATION EMAIL
    // =====================================================

    private void sendVerificationEmail(User user) {

        try {

            String link =
                    appBaseUrl
                            + "/api/auth/verify-email?token="
                            + user.getVerificationToken();

            String html =
                    "<div style='font-family:Arial,sans-serif'>"
                    + "<h2>Verify your email</h2>"
                    + "<p>Hi "
                    + user.getName()
                    + ", please confirm your email.</p>"
                    + "<p>"
                    + "<a href='"
                    + link
                    + "' "
                    + "style='display:inline-block;"
                    + "padding:10px 16px;"
                    + "background:#6366f1;"
                    + "color:#fff;"
                    + "border-radius:6px;"
                    + "text-decoration:none;'>"
                    + "Verify Email"
                    + "</a>"
                    + "</p>"
                    + "<p>Or copy this link:</p>"
                    + "<p>"
                    + link
                    + "</p>"
                    + "<p>This link expires in 24 hours.</p>"
                    + "</div>";

            emailService.sendHtmlEmail(
                    user.getEmail(),
                    "Verify your email",
                    html
            );

        } catch (Exception e) {

            log.error(
                    "Verification email error: {}",
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Failed to send verification email."
            );
        }
    }

    // =====================================================
    // CREATE AUTH RESPONSE
    // =====================================================

    private AuthResponse toResponse(User user) {

        String subscriptionPlan =
                user.getSubscriptionPlan();

        if (subscriptionPlan == null
                || subscriptionPlan.isBlank()) {

            subscriptionPlan = "BASIC";
        }

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImageUrl(
                        user.getProfileImageUrl()
                )
                .subscriptionPlan(
                        subscriptionPlan
                )
                .emailVerified(
                        user.isEmailVerified()
                )
                .createdAt(
                        user.getCreatedAt()
                )
                .updatedAt(
                        user.getUpdatedAt()
                )
                .build();
    }

    // =====================================================
    // CREATE USER DOCUMENT
    // =====================================================

    private User toDocument(
            RegisterRequest request,
            String email) {

        return User.builder()
                .name(request.getName())
                .email(email)
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .profileImageUrl(
                        request.getProfileImageUrl()
                )
                .subscriptionPlan("BASIC")
                .emailVerified(false)
                .verificationToken(
                        UUID.randomUUID().toString()
                )
                .verificationExpires(
                        LocalDateTime.now().plusHours(24)
                )
                .build();
    }

    // =====================================================
    // VERIFY EMAIL
    // =====================================================

    public void verifyEmail(String token) {

        User user =
                userRepository
                        .findByVerificationToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid or expired verification token."
                                )
                        );

        if (user.getVerificationExpires() != null
                && user.getVerificationExpires()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Verification token has expired."
            );
        }

        user.setEmailVerified(true);

        user.setVerificationToken(null);

        user.setVerificationExpires(null);

        userRepository.save(user);

        log.info(
                "Email verified successfully: {}",
                user.getEmail()
        );
    }

    // =====================================================
    // LOGIN
    // =====================================================

    public AuthResponse login(
            LoginRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        String password =
                request.getPassword();

        log.info(
                "Login attempt for email: {}",
                email
        );

        User existingUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password."
                                )
                        );

        if (existingUser.getPassword() == null
                || existingUser.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        if (!passwordEncoder.matches(
                password,
                existingUser.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        String token =
                jwtUtil.generateToken(
                        existingUser.getId()
                );

        AuthResponse response =
                toResponse(existingUser);

        response.setToken(token);

        log.info(
                "Login successful for email: {}",
                email
        );

        return response;
    }

    // =====================================================
    // RESEND VERIFICATION
    // =====================================================

    public void resendVerification(
            String email) {

        email =
                email.trim()
                        .toLowerCase();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        if (user.isEmailVerified()) {

            throw new RuntimeException(
                    "Email is already verified."
            );
        }

        user.setVerificationToken(
                UUID.randomUUID().toString()
        );

        user.setVerificationExpires(
                LocalDateTime.now().plusHours(24)
        );

        userRepository.save(user);

        sendVerificationEmail(user);

        log.info(
                "Verification email resent to: {}",
                email
        );
    }

    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    public void forgotPassword(
            String email) {

        email =
                email.trim()
                        .toLowerCase();

        log.info(
                "Forgot password request: {}",
                email
        );

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with this email."
                                )
                        );

        String resetToken =
                UUID.randomUUID().toString();

        user.setResetPasswordToken(
                resetToken
        );

        user.setResetPasswordExpires(
                LocalDateTime.now()
                        .plusMinutes(30)
        );

        userRepository.save(user);

        // =================================================
        // FRONTEND RESET PASSWORD LINK
        // =================================================

        String resetLink =
                frontendUrl
                        + "/reset-password.html?token="
                        + resetToken;

        log.info(
                "Reset password link generated: {}",
                resetLink
        );

        // =================================================
        // EMAIL HTML
        // =================================================

        String html =
                "<div style='font-family:Arial,sans-serif'>"
                + "<h2>Password Reset Request</h2>"
                + "<p>Hi "
                + user.getName()
                + ",</p>"
                + "<p>You requested to reset your password.</p>"
                + "<p>"
                + "<a href='"
                + resetLink
                + "' "
                + "style='display:inline-block;"
                + "padding:12px 20px;"
                + "background:#2563eb;"
                + "color:white;"
                + "border-radius:6px;"
                + "text-decoration:none;'>"
                + "Reset Password"
                + "</a>"
                + "</p>"
                + "<p>This link will expire in 30 minutes.</p>"
                + "<p>If you did not request this, ignore this email.</p>"
                + "<p>Or copy this link:</p>"
                + "<p>"
                + resetLink
                + "</p>"
                + "</div>";

        try {

            emailService.sendHtmlEmail(
                    user.getEmail(),
                    "Reset Your Password",
                    html
            );

            log.info(
                    "Password reset email sent to: {}",
                    user.getEmail()
            );

        } catch (Exception e) {

            log.error(
                    "Password reset email error: {}",
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Failed to send password reset email."
            );
        }
    }

    // =====================================================
    // RESET PASSWORD
    // =====================================================

    public void resetPassword(
            String token,
            String newPassword) {

        User user =
                userRepository
                        .findByResetPasswordToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid reset token."
                                )
                        );

        if (user.getResetPasswordExpires() == null
                || user.getResetPasswordExpires()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Reset token has expired."
            );
        }

        if (newPassword == null
                || newPassword.length() < 6) {

            throw new RuntimeException(
                    "Password must be at least 6 characters."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        user.setResetPasswordToken(null);

        user.setResetPasswordExpires(null);

        userRepository.save(user);

        log.info(
                "Password reset successfully for: {}",
                user.getEmail()
        );
    }

    // =====================================================
    // CHANGE PLAN
    // =====================================================
    //
    // This method is used for FREE/BASIC downgrade.
    //
    // Premium is NOT activated here.
    // Premium is activated only after successful
    // Razorpay payment verification.
    //
    // =====================================================

    public void changePlan(
            Object principalObject,
            String plan) {

        if (principalObject == null) {

            throw new RuntimeException(
                    "Authentication required."
            );
        }

        if (plan == null
                || plan.isBlank()) {

            throw new RuntimeException(
                    "Plan is required."
            );
        }

        String normalizedPlan =
                plan.trim()
                        .toUpperCase();

        // -----------------------------------------
        // Only BASIC is allowed here
        // -----------------------------------------

        if (!normalizedPlan.equals("BASIC")) {

            throw new RuntimeException(
                    "Only Free plan downgrade is available."
            );
        }

        User user =
                (User) principalObject;

        // -----------------------------------------
        // Update subscription
        // -----------------------------------------

        user.setSubscriptionPlan("BASIC");

        user.setUpdatedAt(
                LocalDateTime.now()
        );

        userRepository.save(user);

        log.info(
                "Subscription plan changed to BASIC for user: {}",
                user.getEmail()
        );
    }

    // =====================================================
    // GET PROFILE
    // =====================================================

    public AuthResponse getProfile(
            Object principalObject) {

        if (principalObject == null) {

            throw new RuntimeException(
                    "Authentication required."
            );
        }

        User existingUser =
                (User) principalObject;

        return toResponse(
                existingUser
        );
    }
}