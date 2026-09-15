package com.jai.resumebuilderapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName = "pnavsy0q";

    @Value("${cloudinary.api-key}")
    private String apiKey = "965829496842642";

    @Value("${cloudinary.api-secret}")
    private String apiSecret = "3uIi48kFI173uYOcqqs0ZlHFL7M";

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }
}
