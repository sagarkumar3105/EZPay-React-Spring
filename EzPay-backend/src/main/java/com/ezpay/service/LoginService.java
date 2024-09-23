package com.ezpay.service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * @author Sagar Kumar
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ezpay.entity.Customer;
import com.ezpay.entity.LoginData;
import com.ezpay.repository.LoginDataRepository;
import com.ezpay.repository.MasterDataRepository;
import com.ezpay.utils.PasswordUtils;

import jakarta.transaction.Transactional;

@Service
public class LoginService {
	
	 @Autowired
	 private LoginDataRepository loginDataRepository;
	 
//	 @Autowired
//	 private MasterDataRepository masterDataRepository;
	 
	 @Autowired
	 private RegistrationService masterDataservice;
	 
	@Transactional
	 public boolean authenticate(String userId, String password) {
	        // Find login data by user ID
	        Optional<LoginData> loginDataOpt = loginDataRepository.findById(userId);
	        
	        
	        if (loginDataOpt.isPresent()) {
	            LoginData loginData = loginDataOpt.get();
	            // Compare the hashed password with the provided password
	            return PasswordUtils.verifyPassword(password, loginData.getPasswordHash());
	        }
	        return false; // User not found
	 }
	 
	 @Transactional
	 public boolean registerUser(String userId, String password)
	 {
		// Check if userId already exists
	        if (loginDataRepository.findByUserId(userId).isPresent()) {
	            return false; // userId already exists
	        }
	        // Creating a temporary customer object for initial registration.
	        Customer customer = masterDataservice.AddTempProfileDetails(userId);
	        
	        String hashedPassword=PasswordUtils.hashPassword(password);
	        
	        // Create LoginData object
	        LoginData loginData = new LoginData();
	        loginData.setUserId(userId);
	        loginData.setPasswordHash(hashedPassword);
	        
	        loginData.setCustomer(customer);
	        
	        loginData.setBlockedCode(0); // Default value
	        
	        // Save the LoginData
	        loginDataRepository.save(loginData);
	        return true; // Registration successful
	 }

	public boolean getIsProfileInfoSetStatus(String userId) {
	    Boolean profileSetStatus = loginDataRepository.findById(userId).get().getCustomer().getIsProfileInfoSet();
	    
		return profileSetStatus;
	}

	public Long getCustomerId(String userId) {
		
		return loginDataRepository.findById(userId).get().getCustomer().getCustomerId();
	}
	
}
