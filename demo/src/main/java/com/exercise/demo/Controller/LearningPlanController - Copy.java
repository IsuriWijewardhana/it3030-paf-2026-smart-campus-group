package com.exercise.demo.Controller;

import com.exercise.demo.Entity.LearningPlan;
import com.exercise.demo.Service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping("/save")
    public ResponseEntity<?> saveLearningPlan(@RequestBody LearningPlan learningPlan) {
        LearningPlan savedPlan = learningPlanService.saveLearningPlan(learningPlan);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Learning plan saved successfully");
        response.put("learningPlanId", savedPlan.get_id());
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/getall")
    public Iterable<LearningPlan> getAllLearningPlans() {
        return learningPlanService.getAllLearningPlans();
    }

    @GetMapping("/public")
    public Iterable<LearningPlan> getPublicLearningPlans() {
        return learningPlanService.getPublicLearningPlans();
    }

    @GetMapping("/user/{userId}")
    public Iterable<LearningPlan> getLearningPlansByUserId(@PathVariable String userId) {
        return learningPlanService.getLearningPlansByUserId(userId);
    }

    @GetMapping("/user/{userId}/public")
    public Iterable<LearningPlan> getPublicLearningPlansByUserId(@PathVariable String userId) {
        return learningPlanService.getPublicLearningPlansByUserId(userId);
    }

    @GetMapping("/status/{status}")
    public Iterable<LearningPlan> getLearningPlansByStatus(@PathVariable String status) {
        return learningPlanService.getLearningPlansByStatus(status);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public Iterable<LearningPlan> getLearningPlansByUserIdAndStatus(
            @PathVariable String userId, @PathVariable String status) {
        return learningPlanService.getLearningPlansByUserIdAndStatus(userId, status);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLearningPlanById(@PathVariable String id) {
        Optional<LearningPlan> learningPlanOpt = learningPlanService.getLearningPlanById(id);
        
        if (learningPlanOpt.isPresent()) {
            return new ResponseEntity<>(learningPlanOpt.get(), HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Learning plan not found");
            
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateLearningPlan(@RequestBody LearningPlan learningPlan, @PathVariable String id) {
        Optional<LearningPlan> existingPlanOpt = learningPlanService.getLearningPlanById(id);
        
        if (existingPlanOpt.isPresent()) {
            learningPlan.set_id(id);
            LearningPlan updatedPlan = learningPlanService.saveLearningPlan(learningPlan);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Learning plan updated successfully");
            response.put("learningPlan", updatedPlan);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Learning plan not found");
            
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLearningPlan(@PathVariable String id) {
        Optional<LearningPlan> learningPlanOpt = learningPlanService.getLearningPlanById(id);
        
        if (learningPlanOpt.isPresent()) {
            learningPlanService.deleteLearningPlan(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Learning plan deleted successfully");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Learning plan not found");
            
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
