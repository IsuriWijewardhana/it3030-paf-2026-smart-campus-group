package com.exercise.demo.Service;

import com.exercise.demo.Entity.UserProfile;
import com.exercise.demo.Repo.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepo userProfileRepo;

    public UserProfile saveUserProfile(UserProfile userProfile) {
        // Set creation date if new profile
        if (userProfile.get_id() == null) {
            userProfile.setCreatedAt(new Date());
        }
        
        // Always update the updatedAt field
        userProfile.setUpdatedAt(new Date());
        
        return userProfileRepo.save(userProfile);
    }

    public UserProfile getOrCreateUserProfile(String userId) {
        UserProfile userProfile = userProfileRepo.findByUserId(userId);
        
        if (userProfile == null) {
            // Create a new profile if one doesn't exist
            userProfile = new UserProfile();
            userProfile.setUserId(userId);
            userProfile.setBio("Tell us about yourself...");
            userProfile.setProfilePictureUrl("https://via.placeholder.com/150");
            userProfile.setSkills("");
            userProfile.setInterests("");
            userProfile = saveUserProfile(userProfile);
        }
        
        return userProfile;
    }

    public Iterable<UserProfile> getAllUserProfiles() {
        return userProfileRepo.findAll();
    }

    public UserProfile getUserProfileByUserId(String userId) {
        return userProfileRepo.findByUserId(userId);
    }

    public Optional<UserProfile> getUserProfileById(String id) {
        return userProfileRepo.findById(id);
    }

    public void deleteUserProfile(String id) {
        userProfileRepo.deleteById(id);
    }

    public void updateFollowersCount(String userId, int count) {
        UserProfile userProfile = userProfileRepo.findByUserId(userId);
        if (userProfile != null) {
            userProfile.setFollowersCount(count);
            userProfileRepo.save(userProfile);
        }
    }

    public void updateFollowingCount(String userId, int count) {
        UserProfile userProfile = userProfileRepo.findByUserId(userId);
        if (userProfile != null) {
            userProfile.setFollowingCount(count);
            userProfileRepo.save(userProfile);
        }
    }
}
