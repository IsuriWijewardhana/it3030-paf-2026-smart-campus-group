package com.exercise.demo.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "comments")
public class Comment {

    @Id
    private String _id;
    private String content;
    private String userId;
    private String username;
    private String resourceId; // ID of the learning plan or other resource being commented on
    private String resourceType; // Type of resource (e.g., "LEARNING_PLAN", "COURSE")
    private Date createdAt;
    private Date updatedAt;
    private boolean isEdited;

    public Comment() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isEdited = false;
    }

    public Comment(String content, String userId, String username, String resourceId, String resourceType) {
        this.content = content;
        this.userId = userId;
        this.username = username;
        this.resourceId = resourceId;
        this.resourceType = resourceType;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isEdited = false;
    }

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        this.updatedAt = new Date();
        this.isEdited = true;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isEdited() {
        return isEdited;
    }

    public void setEdited(boolean edited) {
        isEdited = edited;
    }
}
