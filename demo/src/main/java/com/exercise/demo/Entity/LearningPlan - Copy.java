package com.exercise.demo.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "learning_plans")
public class LearningPlan {

    @Id
    private String _id;
    private String title;
    private String description;
    private String userId;
    private String username;
    private Date createdAt;
    private Date updatedAt;
    private List<Topic> topics;
    private List<Resource> resources;
    private Date completionDeadline;
    private int likesCount;
    private int commentsCount;
    private String status; // "IN_PROGRESS", "COMPLETED", "NOT_STARTED"
    private boolean isPublic;

    public LearningPlan() {
        this.topics = new ArrayList<>();
        this.resources = new ArrayList<>();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.likesCount = 0;
        this.commentsCount = 0;
        this.status = "NOT_STARTED";
        this.isPublic = true;
    }

    // Static inner class for topics
    public static class Topic {
        private String title;
        private String description;
        private boolean completed;
        
        public Topic() {
            this.completed = false;
        }
        
        public Topic(String title, String description) {
            this.title = title;
            this.description = description;
            this.completed = false;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }

    // Static inner class for resources
    public static class Resource {
        private String title;
        private String url;
        private String type; // "VIDEO", "ARTICLE", "BOOK", "OTHER"
        
        public Resource() {
        }
        
        public Resource(String title, String url, String type) {
            this.title = title;
            this.url = url;
            this.type = type;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public Date getCompletionDeadline() {
        return completionDeadline;
    }

    public void setCompletionDeadline(Date completionDeadline) {
        this.completionDeadline = completionDeadline;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    public int getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(int commentsCount) {
        this.commentsCount = commentsCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
