package com.careercrafter.dto;

import com.careercrafter.entity.Notification;
import lombok.Data;

import java.time.LocalDateTime;

public class NotificationDto {

    @Data
    public static class NotificationResponse {
        private Long id;
        private String title;
        private String message;
        private boolean read;
        private String link;
        private LocalDateTime createdAt;

        public static NotificationResponse from(Notification n) {
            NotificationResponse r = new NotificationResponse();
            r.id = n.getId();
            r.title = n.getTitle();
            r.message = n.getMessage();
            r.read = n.isRead();
            r.link = n.getLink();
            r.createdAt = n.getCreatedAt();
            return r;
        }
    }

    @Data
    public static class UnreadCountResponse {
        private long count;

        public UnreadCountResponse(long count) {
            this.count = count;
        }
    }
}
