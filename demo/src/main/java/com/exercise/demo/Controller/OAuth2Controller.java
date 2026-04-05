package com.exercise.demo.Controller;

import com.exercise.demo.Entity.User;
import com.exercise.demo.Entity.UserProfile;
import com.exercise.demo.Service.UserProfileService;
import com.exercise.demo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/oauth2")
public class OAuth2Controller {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/success")
    public ResponseEntity<?> getOAuth2UserInfo(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Not authenticated");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        // Extract user info from OAuth2 provider
        String provider = principal.getAttribute("provider") != null ? 
                          principal.getAttribute("provider").toString() : "unknown";
        String providerId = principal.getName();
        String email = principal.getAttribute("email") != null ? 
                       principal.getAttribute("email").toString() : "";
        String name = principal.getAttribute("name") != null ? 
                      principal.getAttribute("name").toString() : "";
        String imageUrl = principal.getAttribute("picture") != null ? 
                          principal.getAttribute("picture").toString() : "";

        // Find or create user
        User user = userService.findOrCreateOAuth2User(name, email, provider, providerId, imageUrl);
        
        // Ensure user has a profile
        UserProfile userProfile = userProfileService.getOrCreateUserProfile(user.get_id());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "OAuth2 authentication successful");
        response.put("userId", user.get_id());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("provider", user.getProvider());
        response.put("imageUrl", user.getImageUrl());
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
