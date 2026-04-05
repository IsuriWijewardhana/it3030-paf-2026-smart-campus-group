package com.exercise.demo.Repo;

import com.exercise.demo.Entity.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepo extends MongoRepository<Follow, String> {
    Iterable<Follow> findByFollowerId(String followerId);
    Iterable<Follow> findByFollowingId(String followingId);
    Follow findByFollowerIdAndFollowingId(String followerId, String followingId);
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);
    long countByFollowerId(String followerId);
    long countByFollowingId(String followingId);
}
