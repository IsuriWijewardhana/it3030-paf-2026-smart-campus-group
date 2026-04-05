package com.exercise.demo.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "follows")
public class Follow {

    @Id
    private String _id;
    private String followerId; // User who is following
    private String followerUsername;
    private String followingId; // User being followed
    private String followingUsername;
    private Date createdAt;

    public Follow() {
        this.createdAt = new Date();
    }

    public Follow(String followerId, String followerUsername, String followingId, String followingUsername) {
        this.followerId = followerId;
        this.followerUsername = followerUsername;
        this.followingId = followingId;
        this.followingUsername = followingUsername;
        this.createdAt = new Date();
    }

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getFollowerId() {
        return followerId;
    }

    public void setFollowerId(String followerId) {
        this.followerId = followerId;
    }

    public String getFollowerUsername() {
        return followerUsername;
    }

    public void setFollowerUsername(String followerUsername) {
        this.followerUsername = followerUsername;
    }

    public String getFollowingId() {
        return followingId;
    }

    public void setFollowingId(String followingId) {
        this.followingId = followingId;
    }

    public String getFollowingUsername() {
        return followingUsername;
    }

    public void setFollowingUsername(String followingUsername) {
        this.followingUsername = followingUsername;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
