package com.careermitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Long bookingId;
    private Double amount;
    private String status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private java.time.LocalDateTime createdAt;
}
