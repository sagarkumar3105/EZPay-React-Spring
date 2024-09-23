package com.ezpay.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Sagar Kumar
 */

import org.springframework.stereotype.Service;

import com.ezpay.entity.Customer;
import com.ezpay.repository.MasterDataRepository;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.transaction.Transactional;

@Service
public class RegistrationService {

	@Autowired
	private MasterDataRepository masterDataRepository;
	
	@Transactional
	public Customer AddTempProfileDetailsAndSave(String userId) {
		Customer customer=new Customer();
        customer.setName(userId); // Temporary value
        customer.setEmail(userId); // Temporary value
        customer.setMobileNumber(userId); // Temporary value
        customer.setAddress(userId); // Temporary value
        customer.setDob(LocalDateTime.now()); // Temporary DOB
        customer.setGender(userId); // Temporary value
        customer.setProfilePictureUrl(null); // Empty or placeholder for profile picture
        customer.setUpiId(userId); // Temporary UPI ID
        customer.setBankAccountNumber(userId); // Temporary bank account number
        customer.setIfscCode(userId); // Temporary IFSC code
        customer.setAccountType(1); 
        
        // Fixed values
        customer.setProfileCreationDate(LocalDateTime.now()); // Current date
        customer.setProfileLastUpdatedDate(LocalDateTime.now()); // Current date
        customer.setIsProfileInfoSet(false); // Initial setup
        
		masterDataRepository.save(customer);
		return customer;
	}
	
	@Transactional
	public boolean AddInitialProfileDetails(JsonNode payload) {
        Optional<Customer> customerOp = masterDataRepository.findById(payload.get("customerId").asLong());
        
        if(!customerOp.isPresent()) {
        return false; //User not found
        }
        Customer customer=customerOp.get();

        customer.setName(payload.get("name").asText());
        customer.setEmail(payload.get("email").asText());
        customer.setMobileNumber(payload.get("mobileNumber").asText());
        customer.setAddress(payload.get("address").asText());

        String dobString = payload.get("dob").asText("1800-01-01")+"T00:00:00";
        LocalDateTime dob = LocalDateTime.parse(dobString, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        customer.setDob(dob);
        
        customer.setGender(payload.get("gender").asText());
        customer.setProfilePictureUrl(payload.get("profilePictureUrl").asText().getBytes()); 
        customer.setIsProfileInfoSet(true); 
        
        String upiId=payload.get("mobileNumber").asText()+"@ezpay";
        customer.setUpiId(upiId);
     
        customer.setBankAccountNumber(payload.get("bankAccountNumber").asText()); 
        customer.setIfscCode(payload.get("ifscCode").asText()); 
        customer.setAccountType(payload.get("accountType").asInt());
        
        System.out.println(customer);
        masterDataRepository.save(customer);
        return true; // Details updated
	}
	
	
	public Customer getCustomerProfile(Long customerId) {
		return masterDataRepository.findById(customerId).get();
	}
	
	public boolean checkEmailExists(JsonNode payload) {
		List<Customer> customers = masterDataRepository.findByEmail(payload.get("email").asText());
		return customers.isEmpty();
	}
	public boolean checkMobileNumberExists(JsonNode payload){
		List<Customer> customers = masterDataRepository.findByMobileNumber(payload.get("mobileNumber").asText());
		return customers.isEmpty();
	}
}
