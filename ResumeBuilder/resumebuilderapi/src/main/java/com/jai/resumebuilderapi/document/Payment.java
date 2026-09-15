package com.jai.resumebuilderapi.document;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document(collection = "payments")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment {

    @Id
    @JsonProperty("_id")
    private String id;

    private String userId;

    private String razorpayPaymentId;

    private String razorpayOrderId;

    private String razorpaySignature;

    private Integer amount;

    private String currency;

    private String planType;

    @Builder.Default
    private String status = "created";

    private String receipt;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}