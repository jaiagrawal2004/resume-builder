package com.jai.resumebuilderapi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jai.resumebuilderapi.document.Payment;
import com.jai.resumebuilderapi.service.PaymentService;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    // =====================================================
    // CREATE PAYMENT ORDER
    // =====================================================

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) throws RazorpayException {

        String planType = request.get("planType");

        if (!"PREMIUM".equalsIgnoreCase(planType)) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Invalid plan type"
                            )
                    );
        }

        try {

            Payment payment =
                    paymentService.createOrder(
                            authentication.getPrincipal(),
                            "PREMIUM"
                    );

            Map<String, Object> response =
                    Map.of(
                            "success",
                            true,
                            "orderId",
                            payment.getRazorpayOrderId(),
                            "amount",
                            payment.getAmount(),
                            "currency",
                            payment.getCurrency(),
                            "receipt",
                            payment.getReceipt()
                    );

            log.info(
                    "Razorpay order created. User: {}, Order: {}, Amount: ₹{}",
                    authentication.getName(),
                    payment.getRazorpayOrderId(),
                    payment.getAmount() / 100
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            log.error(
                    "Error creating payment order",
                    e
            );

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to create payment order"
                            )
                    );
        }
    }

    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {

        /*
         * IMPORTANT:
         *
         * Razorpay frontend sends these exact field names:
         *
         * razorpay_payment_id
         * razorpay_order_id
         * razorpay_signature
         */

        String razorpayPaymentId =
                request.get("razorpay_payment_id");

        String razorpayOrderId =
                request.get("razorpay_order_id");

        String razorpaySignature =
                request.get("razorpay_signature");

        log.info(
                "Payment verification request received. Order ID: {}, Payment ID: {}",
                razorpayOrderId,
                razorpayPaymentId
        );

        // -------------------------------------------------
        // CHECK PAYMENT DETAILS
        // -------------------------------------------------

        if (razorpayPaymentId == null
                || razorpayPaymentId.isBlank()
                || razorpayOrderId == null
                || razorpayOrderId.isBlank()
                || razorpaySignature == null
                || razorpaySignature.isBlank()) {

            log.warn(
                    "Payment verification failed: missing payment details"
            );

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Missing payment details"
                            )
                    );
        }

        try {

            // -------------------------------------------------
            // VERIFY PAYMENT WITH RAZORPAY
            // -------------------------------------------------

            boolean isValid =
                    paymentService.verifyPayment(
                            authentication.getPrincipal(),
                            razorpayPaymentId,
                            razorpayOrderId,
                            razorpaySignature
                    );

            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (isValid) {

                log.info(
                        "Payment verified successfully. Order ID: {}, Payment ID: {}",
                        razorpayOrderId,
                        razorpayPaymentId
                );

                return ResponseEntity.ok(
                        Map.of(
                                "success",
                                true,
                                "message",
                                "Payment verified successfully",
                                "subscriptionPlan",
                                "PREMIUM"
                        )
                );
            }

            // -------------------------------------------------
            // INVALID PAYMENT / SIGNATURE
            // -------------------------------------------------

            log.warn(
                    "Payment verification failed: invalid payment or signature. Order ID: {}",
                    razorpayOrderId
            );

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Invalid payment or payment signature"
                            )
                    );

        } catch (Exception e) {

            log.error(
                    "Error while verifying Razorpay payment. Order ID: {}",
                    razorpayOrderId,
                    e
            );

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Payment verification failed"
                            )
                    );
        }
    }

    // =====================================================
    // PAYMENT HISTORY
    // =====================================================

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                paymentService.getUserPayments(
                        authentication.getPrincipal()
                )
        );
    }

    // =====================================================
    // PAYMENT DETAILS
    // =====================================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPaymentDetails(
            @PathVariable String orderId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                paymentService.getPaymentDetails(
                        authentication.getPrincipal(),
                        orderId
                )
        );
    }
}