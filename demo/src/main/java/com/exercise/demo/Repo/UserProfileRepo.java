package com.exercise.demo.Repo;

import com.exercise.demo.Entity.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepo extends MongoRepository<UserProfile, String> {
    UserProfile findByUserId(String userId);
}
