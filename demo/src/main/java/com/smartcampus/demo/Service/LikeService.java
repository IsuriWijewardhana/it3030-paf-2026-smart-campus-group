package com.smartcampus.demo.Service;

import com.smartcampus.demo.Entity.Like;
import com.smartcampus.demo.Entity.LearningPlan;
import com.smartcampus.demo.Entity.Notification;
import com.smartcampus.demo.Repo.LikeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepo likeRepo;
    
    @Autowired
    private FacilityAssetService facilityAssetService;
    
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
        
        // Update likes count if it's a facility asset like
        if ("LEARNING_PLAN".equals(like.getResourceType()) || "FACILITY_ASSET".equals(like.getResourceType())) {
            Optional<LearningPlan> facilityAssetOpt = facilityAssetService.getFacilityAssetById(like.getResourceId());
            if (facilityAssetOpt.isPresent()) {
                LearningPlan facilityAsset = facilityAssetOpt.get();
                facilityAsset.setLikesCount(facilityAsset.getLikesCount() + 1);
                facilityAssetService.saveFacilityAsset(facilityAsset);
                
                // Create notification for the facility asset owner
                if (!like.getUserId().equals(facilityAsset.getUserId())) {
                    Notification notification = new Notification(
                        facilityAsset.getUserId(),
                        like.getUsername() + " liked your facility asset: " + facilityAsset.getTitle(),
                        "LIKE",
                        facilityAsset.get_id(),
                        "FACILITY_ASSET",
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
            
            // Update likes count if it's a facility asset like
            if ("LEARNING_PLAN".equals(resourceType) || "FACILITY_ASSET".equals(resourceType)) {
                Optional<LearningPlan> facilityAssetOpt = facilityAssetService.getFacilityAssetById(resourceId);
                if (facilityAssetOpt.isPresent()) {
                    LearningPlan facilityAsset = facilityAssetOpt.get();
                    if (facilityAsset.getLikesCount() > 0) {
                        facilityAsset.setLikesCount(facilityAsset.getLikesCount() - 1);
                        facilityAssetService.saveFacilityAsset(facilityAsset);
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
