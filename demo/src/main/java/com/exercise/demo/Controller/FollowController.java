package com.exercise.demo.Controller;

import com.exercise.demo.Entity.Follow;
import com.exercise.demo.Service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/follows")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<?> followUser(@RequestBody Follow follow) {
        Follow savedFollow = followService.followUser(follow);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User followed successfully");
        response.put("followId", savedFollow.get_id());
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/unfollow/follower/{followerId}/following/{followingId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable String followerId, @PathVariable String followingId) {
        
        followService.unfollowUser(followerId, followingId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User unfollowed successfully");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/getall")
    public Iterable<Follow> getAllFollows() {
        return followService.getAllFollows();
    }

    @GetMapping("/followers/{userId}")
    public Iterable<Follow> getFollowersByUserId(@PathVariable String userId) {
        return followService.getFollowersByUserId(userId);
    }

    @GetMapping("/following/{userId}")
    public Iterable<Follow> getFollowingByUserId(@PathVariable String userId) {
        return followService.getFollowingByUserId(userId);
    }

    @GetMapping("/check/follower/{followerId}/following/{followingId}")
    public ResponseEntity<?> checkFollowStatus(
            @PathVariable String followerId, @PathVariable String followingId) {
        
        boolean isFollowing = followService.isFollowing(followerId, followingId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/count/followers/{userId}")
    public ResponseEntity<?> countFollowers(@PathVariable String userId) {
        long count = followService.countFollowers(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/count/following/{userId}")
    public ResponseEntity<?> countFollowing(@PathVariable String userId) {
        long count = followService.countFollowing(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
