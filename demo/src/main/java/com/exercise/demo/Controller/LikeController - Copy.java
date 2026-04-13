package com.exercise.demo.Controller;

import com.exercise.demo.Entity.Like;
import com.exercise.demo.Service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/save")
    public ResponseEntity<?> saveLike(@RequestBody Like like) {
        Like savedLike = likeService.saveLike(like);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Like saved successfully");
        response.put("likeId", savedLike.get_id());
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/user/{userId}/resource/{resourceId}/type/{resourceType}")
    public ResponseEntity<?> removeLike(
            @PathVariable String userId, 
            @PathVariable String resourceId, 
            @PathVariable String resourceType) {
        
        likeService.removeLike(userId, resourceId, resourceType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Like removed successfully");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/getall")
    public Iterable<Like> getAllLikes() {
        return likeService.getAllLikes();
    }

    @GetMapping("/resource/{resourceId}")
    public Iterable<Like> getLikesByResourceId(@PathVariable String resourceId) {
        return likeService.getLikesByResourceId(resourceId);
    }

    @GetMapping("/resource/{resourceId}/type/{resourceType}")
    public Iterable<Like> getLikesByResourceIdAndType(
            @PathVariable String resourceId, @PathVariable String resourceType) {
        return likeService.getLikesByResourceIdAndType(resourceId, resourceType);
    }

    @GetMapping("/user/{userId}")
    public Iterable<Like> getLikesByUserId(@PathVariable String userId) {
        return likeService.getLikesByUserId(userId);
    }

    @GetMapping("/check/user/{userId}/resource/{resourceId}/type/{resourceType}")
    public ResponseEntity<?> checkUserLike(
            @PathVariable String userId, 
            @PathVariable String resourceId, 
            @PathVariable String resourceType) {
        
        boolean hasLiked = likeService.hasUserLiked(userId, resourceId, resourceType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("hasLiked", hasLiked);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/count/resource/{resourceId}/type/{resourceType}")
    public ResponseEntity<?> countLikes(
            @PathVariable String resourceId, @PathVariable String resourceType) {
        
        long count = likeService.countLikesByResourceIdAndType(resourceId, resourceType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/resource/{resourceId}")
    public ResponseEntity<?> deleteLikesByResourceId(@PathVariable String resourceId) {
        likeService.deleteLikesByResourceId(resourceId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Likes deleted successfully");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/resource/{resourceId}/type/{resourceType}")
    public ResponseEntity<?> deleteLikesByResourceIdAndType(
            @PathVariable String resourceId, @PathVariable String resourceType) {
        likeService.deleteLikesByResourceIdAndType(resourceId, resourceType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Likes deleted successfully");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
