package com.exercise.demo.Service;

import com.exercise.demo.Entity.Follow;
import com.exercise.demo.Entity.Notification;
import com.exercise.demo.Repo.FollowRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    @Autowired
    private FollowRepo followRepo;
    
    @Autowired
    private UserProfileService userProfileService;
    
    @Autowired
    private NotificationService notificationService;

    public Follow followUser(Follow follow) {
        // Check if follow relationship already exists
        Follow existingFollow = followRepo.findByFollowerIdAndFollowingId(
            follow.getFollowerId(), follow.getFollowingId());
        
        if (existingFollow != null) {
            return existingFollow; // Already following, return existing relationship
        }
        
        // Create new follow relationship
        Follow savedFollow = followRepo.save(follow);
        
        // Update follower and following counts
        long followingCount = followRepo.countByFollowerId(follow.getFollowerId());
        long followersCount = followRepo.countByFollowingId(follow.getFollowingId());
        
        userProfileService.updateFollowingCount(follow.getFollowerId(), (int) followingCount);
        userProfileService.updateFollowersCount(follow.getFollowingId(), (int) followersCount);
        
        // Create notification for the user being followed
        Notification notification = new Notification(
            follow.getFollowingId(),
            follow.getFollowerUsername() + " started following you",
            "FOLLOW",
            follow.getFollowingId(),
            "USER",
            follow.getFollowerId(),
            follow.getFollowerUsername()
        );
        notificationService.saveNotification(notification);
        
        return savedFollow;
    }

    public void unfollowUser(String followerId, String followingId) {
        Follow follow = followRepo.findByFollowerIdAndFollowingId(followerId, followingId);
        
        if (follow != null) {
            followRepo.delete(follow);
            
            // Update follower and following counts
            long followingCount = followRepo.countByFollowerId(followerId);
            long followersCount = followRepo.countByFollowingId(followingId);
            
            userProfileService.updateFollowingCount(followerId, (int) followingCount);
            userProfileService.updateFollowersCount(followingId, (int) followersCount);
        }
    }

    public Iterable<Follow> getAllFollows() {
        return followRepo.findAll();
    }

    public Iterable<Follow> getFollowersByUserId(String userId) {
        return followRepo.findByFollowingId(userId);
    }

    public Iterable<Follow> getFollowingByUserId(String userId) {
        return followRepo.findByFollowerId(userId);
    }

    public boolean isFollowing(String followerId, String followingId) {
        return followRepo.findByFollowerIdAndFollowingId(followerId, followingId) != null;
    }

    public long countFollowers(String userId) {
        return followRepo.countByFollowingId(userId);
    }

    public long countFollowing(String userId) {
        return followRepo.countByFollowerId(userId);
    }
}
