package com.exercise.demo.Controller;

import com.exercise.demo.Entity.User;
import com.exercise.demo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        System.out.println("Registration request received for username: " + user.getUsername());

        try {
            // Check if username already exists
            boolean usernameExists = userService.existsByUsername(user.getUsername());
            System.out.println("Username exists check: " + usernameExists);

            if (usernameExists) {
                response.put("success", false);
                response.put("message", "Username is already taken");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // Check if email already exists
            boolean emailExists = userService.existsByEmail(user.getEmail());
            System.out.println("Email exists check: " + emailExists);

            if (emailExists) {
                response.put("success", false);
                response.put("message", "Email is already in use");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // Set default role if not provided
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("STUDENT");
            }

            // Register the user
            User registeredUser = userService.registerUser(user);
            System.out.println("User registered with ID: " + registeredUser.get_id());

            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("userId", registeredUser.get_id());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Map<String, Object> response = new HashMap<>();

        if (userService.authenticateUser(username, password)) {
            User user = userService.findByUsername(username);

            response.put("success", true);
            response.put("message", "Login successful");
            response.put("userId", user.get_id());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("success", false);
            response.put("message", "Invalid username or password");

            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}
