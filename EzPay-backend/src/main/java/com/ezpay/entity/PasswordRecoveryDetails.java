package com.ezpay.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**Author: Sandarbha Komujwar
 * Date:08/09/2024
 * Module:Password Recovery 
 */
/**
 * Entity class representing the password recovery details for a customer in the EzPay application.
 * This class contains information related to password recovery, such as the recovery token, its creation and expiration dates, 
 * and the status of the token's usage.
 */
@Entity
public class PasswordRecoveryDetails {
	 @Id
	    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "password_recovery_seq")
	    @SequenceGenerator(name = "password_recovery_seq", sequenceName = "password_recovery_seq", allocationSize = 1)
    private Long recoveryId;

	 @ManyToOne
	 @JoinColumn(name = "customer_id")
    private Customer customer;   // Links password recovery details to the customer entity

    private String token;   // The unique token generated for password recovery
    private LocalDateTime tokenCreationDate;  // The date and time when the token was created
    private LocalDateTime tokenExpirationDate;    // The date and time when the token will expire
    private Boolean isTokenUsed;   // Indicates whether the token has been used or not
    private Boolean passwordResetStatus;  // 0 -> password failed to reset or 1 -> password successfully reset
    
    /**
     * Checks if the password reset token is expired by comparing the expiration date with the current date.
     *
     * @return true if the token has expired, false otherwise
     */
    public Boolean getPasswordResetStatus() {
        return passwordResetStatus;
    }

    public void setPasswordResetStatus(Boolean passwordResetStatus) {
        this.passwordResetStatus = passwordResetStatus;
    }
    
    public boolean isResetTokenExpired() {
        return tokenExpirationDate != null && tokenExpirationDate.isBefore(LocalDateTime.now());
    }

    // Getters and Setters
    public Long getRecoveryId() {
        return recoveryId;
    }

    public void setRecoveryId(Long recoveryId) {
        this.recoveryId = recoveryId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getTokenCreationDate() {
        return tokenCreationDate;
    }

    public void setTokenCreationDate(LocalDateTime tokenCreationDate) {
        this.tokenCreationDate = tokenCreationDate;
    }

    public LocalDateTime getTokenExpirationDate() {
        return tokenExpirationDate;
    }

    public void setTokenExpirationDate(LocalDateTime tokenExpirationDate) {
        this.tokenExpirationDate = tokenExpirationDate;
    }

    public Boolean getIsTokenUsed() {
        return isTokenUsed;
    }

    public void setIsTokenUsed(Boolean isTokenUsed) {
        this.isTokenUsed = isTokenUsed;
    }

	
}
