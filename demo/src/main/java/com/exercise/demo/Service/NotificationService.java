package com.exercise.demo.Service;

import com.exercise.demo.Entity.Notification;
import com.exercise.demo.Repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepo notificationRepo;

    public Notification saveNotification(Notification notification) {
        return notificationRepo.save(notification);
    }

    public Iterable<Notification> getAllNotifications() {
        return notificationRepo.findAll();
    }

    public Iterable<Notification> getNotificationsByUserId(String userId) {
        return notificationRepo.findByUserId(userId);
    }

    public Iterable<Notification> getUnreadNotificationsByUserId(String userId) {
        return notificationRepo.findByUserIdAndIsRead(userId, false);
    }

    public Optional<Notification> getNotificationById(String id) {
        return notificationRepo.findById(id);
    }

    public void markNotificationAsRead(String id) {
        Optional<Notification> notificationOpt = notificationRepo.findById(id);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            notificationRepo.save(notification);
        }
    }

    public void markAllNotificationsAsRead(String userId) {
        Iterable<Notification> notifications = notificationRepo.findByUserIdAndIsRead(userId, false);
        for (Notification notification : notifications) {
            notification.setRead(true);
            notificationRepo.save(notification);
        }
    }

    public void deleteNotification(String id) {
        notificationRepo.deleteById(id);
    }

    public long countUnreadNotifications(String userId) {
        return notificationRepo.countByUserIdAndIsRead(userId, false);
    }
}
