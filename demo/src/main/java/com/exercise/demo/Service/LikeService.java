package com.exercise.demo.Service;

import com.exercise.demo.Entity.Like;
import com.exercise.demo.Entity.LearningPlan;
import com.exercise.demo.Entity.Notification;
import com.exercise.demo.Repo.LikeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepo likeRepo;
    
    @Autowired
    private LearningPlanService learningPlanService;
    
    @Autowired
    private NotificationService notificationService;

    public Like saveLike(Like like) {
        // Check if like already exists
        Like existingLike = likeRepo.findByUserIdAndResourceIdAndResourceType(
            like.getUserId(), like.getResourceId(), like.getResourceType());
        
        if (existingLike != null) {
            return existingLike; // Like already exists, return it
        }
        
        // Create new like
        Like savedLike = likeRepo.save(like);
        
        // Update likes count if it's a learning plan like
        if ("LEARNING_PLAN".equals(like.getResourceType())) {
            Optional<LearningPlan> learningPlanOpt = learningPlanService.getLearningPlanById(like.getResourceId());
            if (learningPlanOpt.isPresent()) {
                LearningPlan learningPlan = learningPlanOpt.get();
                learningPlan.setLikesCount(learningPlan.getLikesCount() + 1);
                learningPlanService.saveLearningPlan(learningPlan);
                
                // Create notification for the learning plan owner
                if (!like.getUserId().equals(learningPlan.getUserId())) {
                    Notification notification = new Notification(
                        learningPlan.getUserId(),
                        like.getUsername() + " liked your learning plan: " + learningPlan.getTitle(),
                        "LIKE",
                        learningPlan.get_id(),
                        "LEARNING_PLAN",
                        like.getUserId(),
                        like.getUsername()
                    );
                    notificationService.saveNotification(notification);
                }
            }
        }
        
        return savedLike;
    }

    public void removeLike(String userId, String resourceId, String resourceType) {
        Like like = likeRepo.findByUserIdAndResourceIdAndResourceType(userId, resourceId, resourceType);
        
        if (like != null) {
            likeRepo.delete(like);
            
            // Update likes count if it's a learning plan like
            if ("LEARNING_PLAN".equals(resourceType)) {
                Optional<LearningPlan> learningPlanOpt = learningPlanService.getLearningPlanById(resourceId);
                if (learningPlanOpt.isPresent()) {
                    LearningPlan learningPlan = learningPlanOpt.get();
                    if (learningPlan.getLikesCount() > 0) {
                        learningPlan.setLikesCount(learningPlan.getLikesCount() - 1);
                        learningPlanService.saveLearningPlan(learningPlan);
                    }
                }
            }
        }
    }

    public Iterable<Like> getAllLikes() {
        return likeRepo.findAll();
    }

    public Iterable<Like> getLikesByResourceId(String resourceId) {
        return likeRepo.findByResourceId(resourceId);
    }

    public Iterable<Like> getLikesByResourceIdAndType(String resourceId, String resourceType) {
        return likeRepo.findByResourceIdAndResourceType(resourceId, resourceType);
    }

    public Iterable<Like> getLikesByUserId(String userId) {
        return likeRepo.findByUserId(userId);
    }

    public boolean hasUserLiked(String userId, String resourceId, String resourceType) {
        return likeRepo.findByUserIdAndResourceIdAndResourceType(userId, resourceId, resourceType) != null;
    }

    public long countLikesByResourceIdAndType(String resourceId, String resourceType) {
        return likeRepo.countByResourceIdAndResourceType(resourceId, resourceType);
    }

    public void deleteLikesByResourceId(String resourceId) {
        likeRepo.deleteByResourceId(resourceId);
    }

    public void deleteLikesByResourceIdAndType(String resourceId, String resourceType) {
        likeRepo.deleteByResourceIdAndResourceType(resourceId, resourceType);
    }
}
