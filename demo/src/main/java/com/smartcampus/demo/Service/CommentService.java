package com.smartcampus.demo.Service;

import com.smartcampus.demo.Entity.Comment;
import com.smartcampus.demo.Entity.LearningPlan;
import com.smartcampus.demo.Entity.Notification;
import com.smartcampus.demo.Repo.CommentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepo commentRepo;
    
    @Autowired
    private FacilityAssetService facilityAssetService;
    
    @Autowired
    private NotificationService notificationService;

    public Comment saveComment(Comment comment) {
        Comment safeComment = Objects.requireNonNull(comment, "comment must not be null");
        // Set creation date if new comment
        if (safeComment.get_id() == null) {
            safeComment.setCreatedAt(new Date());
            
            // Update comments count if it's a facility asset comment
            if ("LEARNING_PLAN".equals(safeComment.getResourceType()) || "FACILITY_ASSET".equals(safeComment.getResourceType())) {
                Optional<LearningPlan> facilityAssetOpt = facilityAssetService.getFacilityAssetById(safeComment.getResourceId());
                if (facilityAssetOpt.isPresent()) {
                    LearningPlan facilityAsset = facilityAssetOpt.get();
                    facilityAsset.setCommentsCount(facilityAsset.getCommentsCount() + 1);
                    facilityAssetService.saveFacilityAsset(facilityAsset);
                    
                    // Create notification for the facility asset owner
                    if (!safeComment.getUserId().equals(facilityAsset.getUserId())) {
                        Notification notification = new Notification(
                            facilityAsset.getUserId(),
                            safeComment.getUsername() + " commented on your facility asset: " + facilityAsset.getTitle(),
                            "COMMENT",
                            facilityAsset.get_id(),
                            "FACILITY_ASSET",
                            safeComment.getUserId(),
                            safeComment.getUsername()
                        );
                        notificationService.saveNotification(notification);
                    }
                }
            }
        } else {
            // For updates, set the updated time and mark as edited
            safeComment.setUpdatedAt(new Date());
            safeComment.setEdited(true);
        }
        
        return commentRepo.save(safeComment);
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
        return commentRepo.findById(Objects.requireNonNull(id, "id must not be null"));
    }

    public void deleteComment(String id) {
        String safeId = Objects.requireNonNull(id, "id must not be null");
        Optional<Comment> commentOpt = commentRepo.findById(safeId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            
            // Update comments count if it's a facility asset comment
            if ("LEARNING_PLAN".equals(comment.getResourceType()) || "FACILITY_ASSET".equals(comment.getResourceType())) {
                Optional<LearningPlan> facilityAssetOpt = facilityAssetService.getFacilityAssetById(comment.getResourceId());
                if (facilityAssetOpt.isPresent()) {
                    LearningPlan facilityAsset = facilityAssetOpt.get();
                    if (facilityAsset.getCommentsCount() > 0) {
                        facilityAsset.setCommentsCount(facilityAsset.getCommentsCount() - 1);
                        facilityAssetService.saveFacilityAsset(facilityAsset);
                    }
                }
            }
            
            commentRepo.deleteById(safeId);
        }
    }

    public void deleteCommentsByResourceId(String resourceId) {
        commentRepo.deleteByResourceId(resourceId);
    }

    public void deleteCommentsByResourceIdAndType(String resourceId, String resourceType) {
        commentRepo.deleteByResourceIdAndResourceType(resourceId, resourceType);
    }
}
