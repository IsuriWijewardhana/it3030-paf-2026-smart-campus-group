package com.smartcampus.demo.Repo;

import com.smartcampus.demo.Entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepo extends MongoRepository<Comment, String> {
    Iterable<Comment> findByResourceId(String resourceId);
    Iterable<Comment> findByResourceIdAndResourceType(String resourceId, String resourceType);
    Iterable<Comment> findByUserId(String userId);
    void deleteByResourceId(String resourceId);
    void deleteByResourceIdAndResourceType(String resourceId, String resourceType);
}
