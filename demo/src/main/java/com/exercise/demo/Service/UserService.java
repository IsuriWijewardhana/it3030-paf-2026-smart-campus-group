package com.exercise.demo.Service;

import com.exercise.demo.Entity.User;
import com.exercise.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User registerUser(User user) {
        // In a real application, you would hash the password here
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(new Date());
        }
        user.setLastLogin(new Date());
        return userRepo.save(user);
    }

    public User findByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public boolean authenticateUser(String username, String password) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            return false;
        }
        // In a real application, you would verify the hashed password
        boolean authenticated = user.getPassword().equals(password);

        if (authenticated) {
            // Update last login time
            user.setLastLogin(new Date());
            userRepo.save(user);
        }

        return authenticated;
    }

    public boolean existsByUsername(String username) {
        return userRepo.findByUsername(username) != null;
    }

    public boolean existsByEmail(String email) {
        return userRepo.findByEmail(email) != null;
    }

    public User findOrCreateOAuth2User(String name, String email, String provider, String providerId, String imageUrl) {
        // Check if user exists by email
        User existingUser = findByEmail(email);

        if (existingUser != null) {
            // Update OAuth2 info if user exists
            existingUser.setProvider(provider);
            existingUser.setProviderId(providerId);
            existingUser.setImageUrl(imageUrl);
            existingUser.setLastLogin(new Date());
            return userRepo.save(existingUser);
        } else {
            // Create new user if not exists using the factory method
            User newUser = User.createOAuthUser(name, email, provider, providerId, imageUrl);
            return userRepo.save(newUser);
        }
    }
}
