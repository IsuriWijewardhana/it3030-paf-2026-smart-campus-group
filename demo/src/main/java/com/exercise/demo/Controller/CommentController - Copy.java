package com.exercise.demo.Controller;

import com.exercise.demo.Entity.Comment;
import com.exercise.demo.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/save")
    public ResponseEntity<?> saveComment(@RequestBody Comment comment) {
        Comment savedComment = commentService.saveComment(comment);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Comment saved successfully");
        response.put("commentId", savedComment.get_id());
        response.put("comment", savedComment);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/getall")
    public Iterable<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/resource/{resourceId}")
    public Iterable<Comment> getCommentsByResourceId(@PathVariable String resourceId) {
        return commentService.getCommentsByResourceId(resourceId);
    }

    @GetMapping("/resource/{resourceId}/type/{resourceType}")
    public Iterable<Comment> getCommentsByResourceIdAndType(
            @PathVariable String resourceId, @PathVariable String resourceType) {
        return commentService.getCommentsByResourceIdAndType(resourceId, resourceType);
    }

    @GetMapping("/user/{userId}")
    public Iterable<Comment> getCommentsByUserId(@PathVariable String userId) {
        return commentService.getCommentsByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentById(@PathVariable String id) {
        Optional<Comment> commentOpt = commentService.getCommentById(id);
        
        if (commentOpt.isPresent()) {
            return new ResponseEntity<>(commentOpt.get(), HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Comment not found");
            
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateComment(@RequestBody Comment comment, @PathVariable String id) {
        Optional<Comment> existingCommentOpt = commentService.getCommentById(id);
        
        if (existingCommentOpt.isPresent()) {
            Comment existingComment = existingCommentOpt.get();
            
            // Only update the content, keep other fields as is
            existingComment.setContent(comment.getContent());
            
            Comment updatedComment = commentService.saveComment(existingComment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Comment updated successfully");
            response.put("comment", updatedComment);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Comment not found");
            
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        Optional<Comment> commentOpt = commentService.getCommentById(id);
        
        if (commentOpt.isPresent()) {
            commentService.deleteComment(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Comment deleted successfully");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Comment not found");
            
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/resource/{resourceId}")
    public ResponseEntity<?> deleteCommentsByResourceId(@PathVariable String resourceId) {
        commentService.deleteCommentsByResourceId(resourceId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Comments deleted successfully");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/resource/{resourceId}/type/{resourceType}")
    public ResponseEntity<?> deleteCommentsByResourceIdAndType(
            @PathVariable String resourceId, @PathVariable String resourceType) {
        commentService.deleteCommentsByResourceIdAndType(resourceId, resourceType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Comments deleted successfully");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
