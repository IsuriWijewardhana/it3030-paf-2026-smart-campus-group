package com.smartcampus.demo.Service;

import com.smartcampus.demo.Entity.LearningPlan;
import com.smartcampus.demo.Repo.FacilityAssetRepo;
import com.smartcampus.demo.Entity.UserProfile;
import com.smartcampus.demo.Repo.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Service
public class FacilityAssetService {

    @Autowired
    private FacilityAssetRepo facilityAssetRepo;
    
    @Autowired
    private UserProfileRepo userProfileRepo;

    public LearningPlan saveFacilityAsset(LearningPlan facilityAsset) {
        // Set creation date if new asset
        if (facilityAsset.get_id() == null) {
            facilityAsset.setCreatedAt(new Date());
            
            // Increment facility assets count in user profile
            UserProfile userProfile = userProfileRepo.findByUserId(facilityAsset.getUserId());
            if (userProfile != null) {
                userProfile.setFacilityAssetsCount(userProfile.getFacilityAssetsCount() + 1);
                userProfileRepo.save(userProfile);
            }
        }
        
        // Always update the updatedAt field
        facilityAsset.setUpdatedAt(new Date());

        return facilityAssetRepo.save(facilityAsset);
    }

    public Iterable<LearningPlan> getAllFacilityAssets() {
        return facilityAssetRepo.findAll();
    }

    public Iterable<LearningPlan> getPublicFacilityAssets() {
        return facilityAssetRepo.findByIsPublic(true);
    }

    public Iterable<LearningPlan> getFacilityAssetsByUserId(String userId) {
        return facilityAssetRepo.findByUserId(userId);
    }

    public Iterable<LearningPlan> getPublicFacilityAssetsByUserId(String userId) {
        return facilityAssetRepo.findByUserIdAndIsPublic(userId, true);
    }

    public Iterable<LearningPlan> getFacilityAssetsByStatus(String status) {
        return facilityAssetRepo.findByStatus(status);
    }

    public Iterable<LearningPlan> getFacilityAssetsByUserIdAndStatus(String userId, String status) {
        return facilityAssetRepo.findByUserIdAndStatus(userId, status);
    }

    public Optional<LearningPlan> getFacilityAssetById(String id) {
        return facilityAssetRepo.findById(Objects.requireNonNull(id, "id must not be null"));
    }

    public void deleteFacilityAsset(String id) {
        String safeId = Objects.requireNonNull(id, "id must not be null");
        Optional<LearningPlan> facilityAssetOpt = facilityAssetRepo.findById(safeId);
        if (facilityAssetOpt.isPresent()) {
            LearningPlan facilityAsset = facilityAssetOpt.get();
            
            // Decrement facility assets count in user profile
            UserProfile userProfile = userProfileRepo.findByUserId(facilityAsset.getUserId());
            if (userProfile != null && userProfile.getFacilityAssetsCount() > 0) {
                userProfile.setFacilityAssetsCount(userProfile.getFacilityAssetsCount() - 1);
                userProfileRepo.save(userProfile);
            }
            
            facilityAssetRepo.deleteById(safeId);
        }
    }

    public void updateLikesCount(String facilityAssetId, int count) {
        Optional<LearningPlan> facilityAssetOpt = facilityAssetRepo.findById(Objects.requireNonNull(facilityAssetId, "facilityAssetId must not be null"));
        if (facilityAssetOpt.isPresent()) {
            LearningPlan facilityAsset = facilityAssetOpt.get();
            facilityAsset.setLikesCount(count);
            facilityAssetRepo.save(facilityAsset);
        }
    }

    public void updateCommentsCount(String facilityAssetId, int count) {
        Optional<LearningPlan> facilityAssetOpt = facilityAssetRepo.findById(Objects.requireNonNull(facilityAssetId, "facilityAssetId must not be null"));
        if (facilityAssetOpt.isPresent()) {
            LearningPlan facilityAsset = facilityAssetOpt.get();
            facilityAsset.setCommentsCount(count);
            facilityAssetRepo.save(facilityAsset);
        }
    }
}
