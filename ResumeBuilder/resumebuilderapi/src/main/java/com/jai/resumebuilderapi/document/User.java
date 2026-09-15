package com.jai.resumebuilderapi.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    private String id;

    private String name;

    private String email;

    private String password;

    private String profileImageUrl;

    private String subscriptionPlan = "basic";

    private boolean emailVerified = false;


    // ========================================
    // EMAIL VERIFICATION
    // ========================================

    private String verificationToken;

    private LocalDateTime verificationExpires;


    // ========================================
    // PASSWORD RESET
    // ========================================

    private String resetPasswordToken;

    private LocalDateTime resetPasswordExpires;


    // ========================================
    // AUDITING
    // ========================================

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;


    // ========================================
    // GETTERS & SETTERS
    // ========================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }


    public String getSubscriptionPlan() {
        return subscriptionPlan;
    }

    public void setSubscriptionPlan(String subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
    }


    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }


    // ========================================
    // VERIFICATION TOKEN
    // ========================================

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(
            String verificationToken
    ) {
        this.verificationToken = verificationToken;
    }


    public LocalDateTime getVerificationExpires() {
        return verificationExpires;
    }

    public void setVerificationExpires(
            LocalDateTime verificationExpires
    ) {
        this.verificationExpires =
                verificationExpires;
    }


    // ========================================
    // RESET PASSWORD TOKEN
    // ========================================

    public String getResetPasswordToken() {
        return resetPasswordToken;
    }

    public void setResetPasswordToken(
            String resetPasswordToken
    ) {
        this.resetPasswordToken =
                resetPasswordToken;
    }


    public LocalDateTime getResetPasswordExpires() {
        return resetPasswordExpires;
    }

    public void setResetPasswordExpires(
            LocalDateTime resetPasswordExpires
    ) {
        this.resetPasswordExpires =
                resetPasswordExpires;
    }


    // ========================================
    // CREATED AT
    // ========================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    // ========================================
    // UPDATED AT
    // ========================================

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }
}