package com.jai.resumebuilderapi.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jai.resumebuilderapi.document.User;

public interface UserRepository
        extends MongoRepository<User, String> {


    // Find user by email
    Optional<User> findByEmail(String email);


    // Check email exists
    Boolean existsByEmail(String email);


    // Find user by verification token
    Optional<User> findByVerificationToken(
            String verificationToken
    );


    // Find user by reset password token
    Optional<User> findByResetPasswordToken(
            String resetPasswordToken
    );
}