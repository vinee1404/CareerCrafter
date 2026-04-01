package com.careercrafter.service;

import com.careercrafter.dto.NotificationDto.*;
import com.careercrafter.entity.Notification;
import com.careercrafter.entity.User;
import com.careercrafter.repository.NotificationRepository;
import com.careercrafter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void createNotification(User user, String title, String message, String link) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .link(link)
                .build();
        notificationRepo.save(n);
    }

    public List<NotificationResponse> getNotifications(String email) {
        User user = getUser(email);
        return notificationRepo.findByUserOrderByCreatedAtDesc(user).stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());
    }

    public UnreadCountResponse getUnreadCount(String email) {
        User user = getUser(email);
        return new UnreadCountResponse(notificationRepo.countByUserAndIsReadFalse(user));
    }

    public void markAllRead(String email) {
        User user = getUser(email);
        notificationRepo.markAllReadByUser(user);
    }

    public void markOneRead(Long notificationId, String email) {
        User user = getUser(email);
        notificationRepo.findById(notificationId).ifPresent(n -> {
            if (n.getUser().getId().equals(user.getId())) {
                n.setRead(true);
                notificationRepo.save(n);
            }
        });
    }
}
