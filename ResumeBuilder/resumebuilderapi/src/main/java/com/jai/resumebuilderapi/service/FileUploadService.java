package com.jai.resumebuilderapi.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jai.resumebuilderapi.document.Resume;
import com.jai.resumebuilderapi.dto.AuthResponse;
import com.jai.resumebuilderapi.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final Cloudinary cloudinary;
    private final AuthService authService;
    private final ResumeRepository resumeRepository;


    // ================= UPLOAD SINGLE IMAGE =================

    public Map<String, String> uploadSingleImage(MultipartFile file)
            throws IOException {

        Map<String, Object> imageUploadResult =
                cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", "image"
                        )
                );

        String imageUrl =
                imageUploadResult
                        .get("secure_url")
                        .toString();

        log.info(
                "Image uploaded successfully: {}",
                imageUrl
        );

        return Map.of(
                "imageUrl",
                imageUrl
        );
    }


    // ================= UPLOAD RESUME IMAGES =================

    public Map<String, String> uploadResumeImages(
            String resumeId,
            MultipartFile thumbnail,
            MultipartFile profileImage,
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

        Map<String, String> returnValue =
                new HashMap<>();

        try {

            // Upload Thumbnail
            if (Objects.nonNull(thumbnail)
                    && !thumbnail.isEmpty()) {

                Map<String, String> uploadResult =
                        uploadSingleImage(thumbnail);

                existingResume.setThumbnailLink(
                        uploadResult.get("imageUrl")
                );

                returnValue.put(
                        "thumbnailLink",
                        uploadResult.get("imageUrl")
                );
            }


            // Upload Profile Image
            if (Objects.nonNull(profileImage)
                    && !profileImage.isEmpty()) {

                Map<String, String> uploadResult =
                        uploadSingleImage(profileImage);

                if (Objects.isNull(
                        existingResume.getProfileInfo()
                )) {

                    existingResume.setProfileInfo(
                            new Resume.ProfileInfo()
                    );
                }

                existingResume
                        .getProfileInfo()
                        .setProfilePreviewUrl(
                                uploadResult.get("imageUrl")
                        );

                returnValue.put(
                        "profilePreviewUrl",
                        uploadResult.get("imageUrl")
                );
            }


            // Save Resume
            resumeRepository.save(existingResume);

            returnValue.put(
                    "message",
                    "Images uploaded successfully."
            );

            return returnValue;

        } catch (IOException e) {

            log.error(
                    "Error uploading images",
                    e
            );

            throw new RuntimeException(
                    "Failed to upload images.",
                    e
            );
        }
    }
}