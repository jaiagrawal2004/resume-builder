package com.jai.resumebuilderapi.service;

import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jai.resumebuilderapi.document.Payment;
import com.jai.resumebuilderapi.document.User;
import com.jai.resumebuilderapi.dto.AuthResponse;
import com.jai.resumebuilderapi.repository.PaymentRepository;
import com.jai.resumebuilderapi.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AuthService authService;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // =====================================================
    // CREATE RAZORPAY ORDER
    // =====================================================

    public Payment createOrder(
            Object principal,
            String planType
    ) throws RazorpayException {

        AuthResponse authResponse =
                authService.getProfile(principal);

        if (!"PREMIUM".equalsIgnoreCase(planType)) {
            throw new IllegalArgumentException(
                    "Invalid plan type. Only PREMIUM is available."
            );
        }

        // Premium = ₹199
        // Razorpay amount is always in paise
        int amount = 19900;

        String currency = "INR";

        String receipt =
                "PREMIUM_" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8);

        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amount
        );

        orderRequest.put(
                "currency",
                currency
        );

        orderRequest.put(
                "receipt",
                receipt
        );

        RazorpayClient razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );

        Order razorpayOrder =
                razorpayClient.orders.create(
                        orderRequest
                );

        Payment newPayment =
                Payment.builder()
                        .userId(
                                authResponse.getId()
                        )
                        .razorpayOrderId(
                                razorpayOrder.get("id")
                        )
                        .amount(amount)
                        .currency(currency)
                        .planType("PREMIUM")
                        .receipt(receipt)
                        .status("created")
                        .build();

        Payment savedPayment =
                paymentRepository.save(
                        newPayment
                );

        log.info(
                "Razorpay order created. User: {}, Order: {}, Amount: ₹{}",
                authResponse.getId(),
                savedPayment.getRazorpayOrderId(),
                amount / 100
        );

        return savedPayment;
    }

    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    public boolean verifyPayment(
            Object principal,
            String razorpayPaymentId,
            String razorpayOrderId,
            String razorpaySignature
    ) {

        try {

            if (razorpayPaymentId == null
                    || razorpayPaymentId.isBlank()
                    || razorpayOrderId == null
                    || razorpayOrderId.isBlank()
                    || razorpaySignature == null
                    || razorpaySignature.isBlank()) {

                log.warn(
                        "Payment verification failed: missing payment details"
                );

                return false;
            }

            AuthResponse authResponse =
                    authService.getProfile(principal);

            String currentUserId =
                    authResponse.getId();

            // Find payment
            Payment payment =
                    paymentRepository
                            .findByRazorpayOrderId(
                                    razorpayOrderId
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Payment order not found."
                                    )
                            );

            // =================================================
            // SECURITY CHECK
            // =================================================

            if (!currentUserId.equals(
                    payment.getUserId()
            )) {

                log.warn(
                        "Unauthorized payment verification attempt. User: {}, Order: {}",
                        currentUserId,
                        razorpayOrderId
                );

                return false;
            }

            // Prevent duplicate verification
            if ("paid".equalsIgnoreCase(
                    payment.getStatus()
            )) {

                log.info(
                        "Payment already verified: {}",
                        razorpayOrderId
                );

                return true;
            }

            // =================================================
            // RAZORPAY SIGNATURE VERIFICATION
            // =================================================

            JSONObject attributes =
                    new JSONObject();

            attributes.put(
                    "razorpay_order_id",
                    razorpayOrderId
            );

            attributes.put(
                    "razorpay_payment_id",
                    razorpayPaymentId
            );

            attributes.put(
                    "razorpay_signature",
                    razorpaySignature
            );

            boolean isValidSignature =
                    Utils.verifyPaymentSignature(
                            attributes,
                            razorpayKeySecret
                    );

            if (!isValidSignature) {

                log.warn(
                        "Invalid Razorpay signature for order: {}",
                        razorpayOrderId
                );

                return false;
            }

            // =================================================
            // MARK PAYMENT AS PAID
            // =================================================

            payment.setStatus("paid");

            payment.setRazorpayPaymentId(
                    razorpayPaymentId
            );

            payment.setRazorpaySignature(
                    razorpaySignature
            );

            paymentRepository.save(payment);

            // =================================================
            // UPGRADE USER
            // =================================================

            upgradeUserSubscription(
                    payment.getUserId(),
                    payment.getPlanType()
            );

            log.info(
                    "Payment verified successfully. User: {}, Order: {}",
                    currentUserId,
                    razorpayOrderId
            );

            return true;

        } catch (Exception e) {

            log.error(
                    "Error verifying Razorpay payment: {}",
                    e.getMessage(),
                    e
            );

            return false;
        }
    }

    // =====================================================
    // UPGRADE USER SUBSCRIPTION
    // =====================================================

    private void upgradeUserSubscription(
            String userId,
            String planType
    ) {

        if (!"PREMIUM".equalsIgnoreCase(
                planType
        )) {

            throw new IllegalArgumentException(
                    "Invalid subscription plan."
            );
        }

        User existingUser =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found"
                                )
                        );

        existingUser.setSubscriptionPlan(
                "PREMIUM"
        );

        userRepository.save(
                existingUser
        );

        log.info(
                "User {} upgraded to PREMIUM plan",
                userId
        );
    }

    // =====================================================
    // PAYMENT HISTORY
    // =====================================================

    public List<Payment> getUserPayments(
            Object principal
    ) {

        AuthResponse authResponse =
                authService.getProfile(principal);

        return paymentRepository
                .findByUserIdOrderByCreatedAtDesc(
                        authResponse.getId()
                );
    }

    // =====================================================
    // PAYMENT DETAILS
    // =====================================================

    public Payment getPaymentDetails(
            Object principal,
            String orderId
    ) {

        AuthResponse authResponse =
                authService.getProfile(principal);

        Payment payment =
                paymentRepository
                        .findByRazorpayOrderId(
                                orderId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found for orderId: "
                                                + orderId
                                )
                        );

        // Security check
        if (!authResponse.getId().equals(
                payment.getUserId()
        )) {

            throw new RuntimeException(
                    "You are not authorized to view this payment."
            );
        }

        return payment;
    }
}