package com.smartcampus.demo.Repo;

import com.smartcampus.demo.Entity.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityAssetRepo extends MongoRepository<LearningPlan, String> {
    Iterable<LearningPlan> findByUserId(String userId);
    Iterable<LearningPlan> findByIsPublic(boolean isPublic);
    Iterable<LearningPlan> findByUserIdAndIsPublic(String userId, boolean isPublic);
    Iterable<LearningPlan> findByStatus(String status);
    Iterable<LearningPlan> findByUserIdAndStatus(String userId, String status);
}