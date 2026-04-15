package com.exercise.demo.Service;

import com.exercise.demo.Entity.Comment;
import com.exercise.demo.Entity.LearningPlan;
import com.exercise.demo.Entity.Notification;
import com.exercise.demo.Repo.CommentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepo commentRepo;
    
    @Autowired
    private LearningPlanService learningPlanService;
    
    @Autowired
    private NotificationService notificationService;

    public Comment saveComment(Comment comment) {
        // Set creation date if new comment
        if (comment.get_id() == null) {
            comment.setCreatedAt(new Date());
            
            // Update comments count if it's a learning plan comment
            if ("LEARNING_PLAN".equals(comment.getResourceType())) {
                Optional<LearningPlan> learningPlanOpt = learningPlanService.getLearningPlanById(comment.getResourceId());
                if (learningPlanOpt.isPresent()) {
                    LearningPlan learningPlan = learningPlanOpt.get();
                    learningPlan.setCommentsCount(learningPlan.getCommentsCount() + 1);
                    learningPlanService.saveLearningPlan(learningPlan);
                    
                    // Create notification for the learning plan owner
                    if (!comment.getUserId().equals(learningPlan.getUserId())) {
                        Notification notification = new Notification(
                            learningPlan.getUserId(),
                            comment.getUsername() + " commented on your learning plan: " + learningPlan.getTitle(),
                            "COMMENT",
                            learningPlan.get_id(),
                            "LEARNING_PLAN",
                            comment.getUserId(),
                            comment.getUsername()
                        );
                        notificationService.saveNotification(notification);
                    }
                }
            }
        } else {
            // For updates, set the updated time and mark as edited
            comment.setUpdatedAt(new Date());
            comment.setEdited(true);
        }
        
        return commentRepo.save(comment);
    }

    public Iterable<Comment> getAllComments() {
        return commentRepo.findAll();
    }

    public Iterable<Comment> getCommentsByResourceId(String resourceId) {
        return commentRepo.findByResourceId(resourceId);
    }

    public Iterable<Comment> getCommentsByResourceIdAndType(String resourceId, String resourceType) {
        return commentRepo.findByResourceIdAndResourceType(resourceId, resourceType);
    }

    public Iterable<Comment> getCommentsByUserId(String userId) {
        return commentRepo.findByUserId(userId);
    }

    public Optional<Comment> getCommentById(String id) {
        return commentRepo.findById(id);
    }

    public void deleteComment(String id) {
        Optional<Comment> commentOpt = commentRepo.findById(id);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            
            // Update comments count if it's a learning plan comment
            if ("LEARNING_PLAN".equals(comment.getResourceType())) {
                Optional<LearningPlan> learningPlanOpt = learningPlanService.getLearningPlanById(comment.getResourceId());
                if (learningPlanOpt.isPresent()) {
                    LearningPlan learningPlan = learningPlanOpt.get();
                    if (learningPlan.getCommentsCount() > 0) {
                        learningPlan.setCommentsCount(learningPlan.getCommentsCount() - 1);
                        learningPlanService.saveLearningPlan(learningPlan);
                    }
                }
            }
            
            commentRepo.deleteById(id);
        }
    }

    public void deleteCommentsByResourceId(String resourceId) {
        commentRepo.deleteByResourceId(resourceId);
    }

    public void deleteCommentsByResourceIdAndType(String resourceId, String resourceType) {
        commentRepo.deleteByResourceIdAndResourceType(resourceId, resourceType);
    }
}
