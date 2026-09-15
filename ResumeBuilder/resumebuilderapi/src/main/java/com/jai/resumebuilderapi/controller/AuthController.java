package com.jai.resumebuilderapi.controller;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jai.resumebuilderapi.dto.AuthResponse;
import com.jai.resumebuilderapi.dto.LoginRequest;
import com.jai.resumebuilderapi.dto.RegisterRequest;
import com.jai.resumebuilderapi.service.AuthService;
import com.jai.resumebuilderapi.service.FileUploadService;
import com.jai.resumebuilderapi.util.AppConstants;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(AppConstants.AUTH_CONTROLLER)
public class AuthController {

    private final AuthService authService;

    private final FileUploadService fileUploadService;


    // ========================================
    // REGISTER
    // ========================================

    @PostMapping(AppConstants.REGISTER)
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        log.info(
                "Inside AuthController - register(): {}",
                request.getEmail()
        );

        try {

            AuthResponse response =
                    authService.register(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception e) {

            log.error(
                    "Registration error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Registration failed."
                            )
                    );
        }
    }


    // ========================================
    // VERIFY EMAIL
    // ========================================

    @GetMapping(AppConstants.VERIFY_EMAIL)
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token
    ) {

        try {

            authService.verifyEmail(token);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Email verified successfully."
                    )
            );

        } catch (Exception e) {

            log.error(
                    "Email verification error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Email verification failed."
                            )
                    );
        }
    }


    // ========================================
    // UPLOAD PROFILE IMAGE
    // ========================================

    @PostMapping(AppConstants.UPLOAD_PROFILE_IMAGE)
    public ResponseEntity<?> uploadImage(
            @RequestPart("image") MultipartFile file
    ) throws IOException {

        log.info(
                "Inside AuthController - uploadImage(): {}",
                file.getOriginalFilename()
        );

        try {

            Map<String, String> response =
                    fileUploadService.uploadSingleImage(file);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            log.error(
                    "Profile image upload error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Image upload failed."
                            )
                    );
        }
    }


    // ========================================
    // LOGIN
    // ========================================

    @PostMapping(AppConstants.LOGIN)
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        log.info(
                "Inside AuthController - login(): {}",
                request.getEmail()
        );

        try {

            AuthResponse response =
                    authService.login(request);

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            log.warn(
                    "Login failed for email: {} - {}",
                    request.getEmail(),
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Invalid email or password."
                            )
                    );

        } catch (Exception e) {

            log.error(
                    "Unexpected login error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Something went wrong while logging in."
                            )
                    );
        }
    }


    // ========================================
    // RESEND VERIFICATION EMAIL
    // ========================================

    @PostMapping(AppConstants.RESEND_VERIFICATION)
    public ResponseEntity<?> resendVerification(
            @RequestBody Map<String, String> body
    ) {

        String email =
                body.get("email");


        if (
                Objects.isNull(email)
                || email.isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Email is required."
                            )
                    );
        }


        try {

            authService.resendVerification(
                    email
            );

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Verification email sent successfully."
                    )
            );

        } catch (Exception e) {

            log.error(
                    "Resend verification error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to resend verification email."
                            )
                    );
        }
    }


    // ========================================
    // FORGOT PASSWORD
    // ========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> body
    ) {

        log.info("========================================");
        log.info("FORGOT PASSWORD REQUEST RECEIVED");
        log.info("Request body: {}", body);

        String email =
                body.get("email");

        log.info(
                "Forgot password email: {}",
                email
        );

        if (
                email == null
                || email.isBlank()
        ) {

            log.warn(
                    "Forgot password failed: Email is empty"
            );

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Email is required."
                            )
                    );
        }

        try {

            log.info(
                    "Calling authService.forgotPassword()..."
            );

            authService.forgotPassword(email);

            log.info(
                    "authService.forgotPassword() completed successfully"
            );

            log.info(
                    "========================================"
            );

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Password reset link has been sent to your email."
                    )
            );

        } catch (Exception e) {

            log.error(
                    "FORGOT PASSWORD ERROR"
            );

            log.error(
                    "Error message: {}",
                    e.getMessage(),
                    e
            );

            log.info(
                    "========================================"
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to process password reset request."
                            )
                    );
        }
    }


    // ========================================
    // RESET PASSWORD
    // ========================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> body
    ) {

        String token =
                body.get("token");

        String newPassword =
                body.get("newPassword");


        // ----------------------------------------
        // Check token
        // ----------------------------------------

        if (
                token == null
                || token.isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Reset token is required."
                            )
                    );
        }


        // ----------------------------------------
        // Check password
        // ----------------------------------------

        if (
                newPassword == null
                || newPassword.isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "New password is required."
                            )
                    );
        }


        // ----------------------------------------
        // Password length
        // ----------------------------------------

        if (
                newPassword.length() < 6
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Password must be at least 6 characters."
                            )
                    );
        }


        try {

            authService.resetPassword(
                    token,
                    newPassword
            );

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Password reset successfully."
                    )
            );

        } catch (Exception e) {

            log.error(
                    "Reset password error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Password reset failed."
                            )
                    );
        }
    }


    // ========================================
    // CHANGE PLAN
    // ========================================
    //
    // This endpoint is ONLY for switching
    // back to the FREE/BASIC plan.
    //
    // PREMIUM must only be activated after
    // successful Razorpay payment verification.
    //
    // ========================================

    @PutMapping("/change-plan")
    public ResponseEntity<?> changePlan(
            Authentication authentication,
            @RequestBody Map<String, String> body
    ) {

        // ----------------------------------------
        // Check authentication
        // ----------------------------------------

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Authentication required."
                            )
                    );
        }


        // ----------------------------------------
        // Get requested plan
        // ----------------------------------------

        String plan =
                body.get("plan");


        if (
                plan == null
                || plan.isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Plan is required."
                            )
                    );
        }


        try {

            Object principalObject =
                    authentication.getPrincipal();


            // ----------------------------------------
            // ONLY BASIC/FREE DOWNGRADE ALLOWED
            // ----------------------------------------

            if (
                    !plan.equalsIgnoreCase("BASIC")
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "success", false,
                                        "message",
                                        "Only Free plan downgrade is available."
                                )
                        );
            }


            // ----------------------------------------
            // CHANGE PLAN
            // ----------------------------------------

            authService.changePlan(
                    principalObject,
                    "BASIC"
            );


            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Free plan activated successfully.",
                            "subscriptionPlan",
                            "BASIC"
                    )
            );

        } catch (Exception e) {

            log.error(
                    "Change plan error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to change plan."
                            )
                    );
        }
    }


    // ========================================
    // GET PROFILE
    // ========================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication
    ) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Authentication required."
                            )
                    );
        }


        try {

            Object principalObject =
                    authentication.getPrincipal();


            AuthResponse currentProfile =
                    authService.getProfile(
                            principalObject
                    );


            return ResponseEntity.ok(
                    currentProfile
            );

        } catch (Exception e) {

            log.error(
                    "Get profile error: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Unable to load profile."
                            )
                    );
        }
    }
}