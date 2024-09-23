package com.ezpay.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ezpay.entity.Customer;
import com.ezpay.service.LoginService;
import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Add this line to allow requests from React
public class LoginController {
	
	@Autowired
	private LoginService loginService;
	
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> loginUser(@RequestBody JsonNode payload) {
	    String userId = payload.get("userId").asText();
	    String password = payload.get("password").asText();
		boolean isLoggedIn = loginService.authenticate(userId, password);
        
        if (isLoggedIn) {
        	boolean isProfileInfoSet = loginService.getIsProfileInfoSetStatus(userId);
        	Long customerId=loginService.getCustomerId(userId);
        	Map<String, Object> response = new HashMap<>();
        	
            response.put("message", "Login successful");
            response.put("profileInfoSetStatus", isProfileInfoSet);
            response.put("customerId", customerId);
            
        	return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid user ID or password"));
        }
    }
	
	@PostMapping("/register-user")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, String> payload) {
        //Customer customer = new Customer();
        // Populate customer fields from the request

        boolean isRegistered = loginService.registerUser(payload.get("userId"), payload.get("password"));
        if (isRegistered) {
            return ResponseEntity.ok("User registered successfully");
        } else {
            return ResponseEntity.status(400).body("User ID already exists");
        }
    }
	
}
