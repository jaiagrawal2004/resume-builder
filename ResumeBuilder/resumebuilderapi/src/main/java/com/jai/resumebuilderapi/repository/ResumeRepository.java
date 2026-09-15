package com.jai.resumebuilderapi.repository;

import java.util.List;
import java.util.Optional;

import com.jai.resumebuilderapi.document.Resume;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResumeRepository extends MongoRepository<Resume, String> {

    List<Resume> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Resume> findByIdAndUserId(String id, String userId);

    
}