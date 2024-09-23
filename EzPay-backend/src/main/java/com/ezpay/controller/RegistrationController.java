package com.ezpay.controller;
/**
 * @author Sagar Kumar
 */
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ezpay.entity.Customer;
import com.ezpay.service.LoginService;
import com.ezpay.service.RegistrationService;
import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Add this line to allow requests from React
public class RegistrationController {

	@Autowired
	private RegistrationService registrationService;
	
	@PutMapping("/check_if_email_present")
	public ResponseEntity<String> checkEmail(@RequestBody JsonNode payload){
		JsonNode value = payload.findValue("email");
		if (value==null){
			return ResponseEntity.status(402).body("the value provided is null");
		}
		
		if (registrationService.checkEmailExists(payload) ){
			return ResponseEntity.ok("Email does not exist");
		}
		else {
			return ResponseEntity.status(401).body("Email already registered");
		}
	}
	
	@PutMapping("/check_if_mobile_present")
	public ResponseEntity<String> checkMobileNumber(@RequestBody JsonNode payload){
		JsonNode value = payload.findValue("mobileNumber");
		if (value==null){
			return ResponseEntity.status(402).body("the value provided is null");
		}
		if (registrationService.checkMobileNumberExists(payload) ){
			return ResponseEntity.ok("Mobile number does not exist");
		}
		else {
			return ResponseEntity.status(401).body("Mobile number already registered");
		}
	}
	@PutMapping("/add-profile-details")
	public ResponseEntity<String> addProfileDetails(@RequestBody JsonNode payload) {
	    
        if (registrationService.AddInitialProfileDetails(payload)) {
            return ResponseEntity.ok("Profile creation Completed");
        } else {
            return ResponseEntity.status(401).body("Profile Details missing");
        }
    }
	@GetMapping("/view-profile")
	public ResponseEntity<Customer> getProfile(@RequestHeader("Key") Long customerId)
	{
		System.out.println("---------->"+customerId);
	    Customer customer = registrationService.getCustomerProfile(customerId);
	    if (customer != null) {
	        return ResponseEntity.ok(customer);
	    } else {
	        return ResponseEntity.status(404).body(null);
	    }
	}
	
}
