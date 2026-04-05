package com.exercise.demo.Service;

import com.exercise.demo.Entity.LearningPlan;
import com.exercise.demo.Entity.UserProfile;
import com.exercise.demo.Repo.LearningPlanRepo;
import com.exercise.demo.Repo.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepo learningPlanRepo;
    
    @Autowired
    private UserProfileRepo userProfileRepo;

    public LearningPlan saveLearningPlan(LearningPlan learningPlan) {
        // Set creation date if new plan
        if (learningPlan.get_id() == null) {
            learningPlan.setCreatedAt(new Date());
            
            // Increment learning plans count in user profile
            UserProfile userProfile = userProfileRepo.findByUserId(learningPlan.getUserId());
            if (userProfile != null) {
                userProfile.setLearningPlansCount(userProfile.getLearningPlansCount() + 1);
                userProfileRepo.save(userProfile);
            }
        }
        
        // Always update the updatedAt field
        learningPlan.setUpdatedAt(new Date());
        
        return learningPlanRepo.save(learningPlan);
    }

    public Iterable<LearningPlan> getAllLearningPlans() {
        return learningPlanRepo.findAll();
    }

    public Iterable<LearningPlan> getPublicLearningPlans() {
        return learningPlanRepo.findByIsPublic(true);
    }

    public Iterable<LearningPlan> getLearningPlansByUserId(String userId) {
        return learningPlanRepo.findByUserId(userId);
    }

    public Iterable<LearningPlan> getPublicLearningPlansByUserId(String userId) {
        return learningPlanRepo.findByUserIdAndIsPublic(userId, true);
    }

    public Iterable<LearningPlan> getLearningPlansByStatus(String status) {
        return learningPlanRepo.findByStatus(status);
    }

    public Iterable<LearningPlan> getLearningPlansByUserIdAndStatus(String userId, String status) {
        return learningPlanRepo.findByUserIdAndStatus(userId, status);
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepo.findById(id);
    }

    public void deleteLearningPlan(String id) {
        Optional<LearningPlan> learningPlanOpt = learningPlanRepo.findById(id);
        if (learningPlanOpt.isPresent()) {
            LearningPlan learningPlan = learningPlanOpt.get();
            
            // Decrement learning plans count in user profile
            UserProfile userProfile = userProfileRepo.findByUserId(learningPlan.getUserId());
            if (userProfile != null && userProfile.getLearningPlansCount() > 0) {
                userProfile.setLearningPlansCount(userProfile.getLearningPlansCount() - 1);
                userProfileRepo.save(userProfile);
            }
            
            learningPlanRepo.deleteById(id);
        }
    }

    public void updateLikesCount(String learningPlanId, int count) {
        Optional<LearningPlan> learningPlanOpt = learningPlanRepo.findById(learningPlanId);
        if (learningPlanOpt.isPresent()) {
            LearningPlan learningPlan = learningPlanOpt.get();
            learningPlan.setLikesCount(count);
            learningPlanRepo.save(learningPlan);
        }
    }

    public void updateCommentsCount(String learningPlanId, int count) {
        Optional<LearningPlan> learningPlanOpt = learningPlanRepo.findById(learningPlanId);
        if (learningPlanOpt.isPresent()) {
            LearningPlan learningPlan = learningPlanOpt.get();
            learningPlan.setCommentsCount(count);
            learningPlanRepo.save(learningPlan);
        }
    }
}
