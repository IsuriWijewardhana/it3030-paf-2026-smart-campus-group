package com.exercise.demo.Repo;

import com.exercise.demo.Entity.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepo extends MongoRepository<Like, String> {
    Iterable<Like> findByResourceId(String resourceId);
    Iterable<Like> findByResourceIdAndResourceType(String resourceId, String resourceType);
    Iterable<Like> findByUserId(String userId);
    Like findByUserIdAndResourceIdAndResourceType(String userId, String resourceId, String resourceType);
    void deleteByResourceId(String resourceId);
    void deleteByResourceIdAndResourceType(String resourceId, String resourceType);
    void deleteByUserIdAndResourceIdAndResourceType(String userId, String resourceId, String resourceType);
    long countByResourceIdAndResourceType(String resourceId, String resourceType);
}
