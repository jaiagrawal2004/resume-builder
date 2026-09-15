package com.jai.resumebuilderapi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.jai.resumebuilderapi.document.Resume;
import com.jai.resumebuilderapi.dto.AuthResponse;
import com.jai.resumebuilderapi.dto.CreateResumeRequest;
import com.jai.resumebuilderapi.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AuthService authService;


    // ================= CREATE RESUME =================

    public Resume createResume(
            CreateResumeRequest request,
            Object principalObject) {

        Resume newResume = new Resume();

        AuthResponse response = authService.getProfile(principalObject);

        // Set User ID
        newResume.setUserId(response.getId());

        // Set Resume Title
        newResume.setTitle(request.getTitle());

        // Set Default Resume Data
        setDefaultResumeData(newResume);

        return resumeRepository.save(newResume);
    }


    // ================= DEFAULT RESUME DATA =================

    private void setDefaultResumeData(Resume newResume) {

        newResume.setTemplate(
                new Resume.Template()
        );

        newResume.setProfileInfo(
                new Resume.ProfileInfo()
        );

        newResume.setContactInfo(
                new Resume.ContactInfo()
        );

        newResume.setWorkExperience(
                new ArrayList<>()
        );

        newResume.setEducation(
                new ArrayList<>()
        );

        newResume.setSkills(
                new ArrayList<>()
        );

        newResume.setProjects(
                new ArrayList<>()
        );

        newResume.setCertifications(
                new ArrayList<>()
        );

        newResume.setLanguages(
                new ArrayList<>()
        );

        newResume.setInterests(
                new ArrayList<>()
        );
    }


    // ================= GET ALL USER RESUMES =================

    public ArrayList<Resume> getUserResumes(Object principal) {

        AuthResponse response =
                authService.getProfile(principal);

        List<Resume> resumes =
                resumeRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                response.getId()
                        );

        return new ArrayList<>(resumes);
    }


    // ================= GET RESUME BY ID =================

    public Resume getResumeById(
            String resumeId,
            Object principal) {

        AuthResponse response =
                authService.getProfile(principal);

        Resume existingResume =
                resumeRepository
                        .findByIdAndUserId(
                                resumeId,
                                response.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found."
                                )
                        );

        return existingResume;
    }


    // ================= UPDATE RESUME =================

    public Resume updateResume(
            String resumeId,
            Resume updatedData,
            Object principal) {

        AuthResponse response =
                authService.getProfile(principal);

        Resume existingResume =
                resumeRepository
                        .findByIdAndUserId(
                                resumeId,
                                response.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found."
                                )
                        );

        existingResume.setTitle(
                updatedData.getTitle()
        );

        existingResume.setThumbnailLink(
                updatedData.getThumbnailLink()
        );

        existingResume.setObjective(
                updatedData.getObjective()
        );

        existingResume.setAchievements(
                updatedData.getAchievements()
        );

        existingResume.setTemplate(
                updatedData.getTemplate()
        );

        existingResume.setProfileInfo(
                updatedData.getProfileInfo()
        );

        existingResume.setContactInfo(
                updatedData.getContactInfo()
        );

        existingResume.setWorkExperience(
                updatedData.getWorkExperience()
        );

        existingResume.setEducation(
                updatedData.getEducation()
        );

        existingResume.setSkills(
                updatedData.getSkills()
        );

        existingResume.setProjects(
                updatedData.getProjects()
        );

        existingResume.setCertifications(
                updatedData.getCertifications()
        );

        existingResume.setLanguages(
                updatedData.getLanguages()
        );

        existingResume.setInterests(
                updatedData.getInterests()
        );

        return resumeRepository.save(existingResume);
    }


    // ================= DELETE RESUME =================

    public void deleteResume(String resumeId, Object principal) {

        AuthResponse response =authService.getProfile(principal);

        Resume existingResume =resumeRepository.findByIdAndUserId(resumeId,response.getId())
            .orElseThrow(() ->new RuntimeException("Resume not found."));

        resumeRepository.delete(existingResume);

        log.info("Resume deleted successfully with id: {}", resumeId);
    }
}