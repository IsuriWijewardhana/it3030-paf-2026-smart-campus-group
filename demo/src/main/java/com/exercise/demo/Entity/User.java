package com.exercise.demo.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "users")
public class User {

    @Id
    private String _id;
    private String username;
    private String password;
    private String email;
    private String role;
    private String provider; // "local", "google", "facebook", etc.
    private String providerId; // ID from the OAuth provider
    private String imageUrl; // Profile picture URL
    private boolean emailVerified;
    private Date createdAt;
    private Date lastLogin;

    public User() {
        this.provider = "local";
        this.emailVerified = false;
        this.createdAt = new Date();
        this.lastLogin = new Date();
    }

    public User(String _id, String username, String password, String email, String role) {
        this._id = _id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.provider = "local";
        this.emailVerified = false;
        this.createdAt = new Date();
        this.lastLogin = new Date();
    }

    // Constructor for OAuth users
    public User(String username, String email, String provider, String providerId, String imageUrl, boolean isOAuth) {
        this.username = username;
        this.email = email;
        this.role = "STUDENT"; // Default role
        this.provider = provider;
        this.providerId = providerId;
        this.imageUrl = imageUrl;
        this.emailVerified = true; // Assuming OAuth providers verify emails
        this.createdAt = new Date();
        this.lastLogin = new Date();
    }

    // Factory method for creating OAuth users
    public static User createOAuthUser(String username, String email, String provider, String providerId, String imageUrl) {
        return new User(username, email, provider, providerId, imageUrl, true);
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    @Override
    public String toString() {
        return "User{" +
                "_id='" + _id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", provider='" + provider + '\'' +
                ", providerId='" + providerId + '\'' +
                ", emailVerified=" + emailVerified +
                ", createdAt=" + createdAt +
                '}';
    }
}
