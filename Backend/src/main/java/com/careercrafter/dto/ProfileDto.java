package com.careercrafter.dto;

import com.careercrafter.entity.Profile;
import lombok.Data;

import java.time.LocalDateTime;

public class ProfileDto {

    @Data
    public static class ProfileRequest {
        private String phone;
        private String location;
        private String headline;
        private String summary;
        private String education;
        private String experience;
        private String skills;
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String headline;
        private String summary;
        private String education;
        private String experience;
        private String skills;
        private String resumeFileName;
        private LocalDateTime updatedAt;

        public static ProfileResponse from(Profile p) {
            ProfileResponse r = new ProfileResponse();
            r.id = p.getId();
            r.userId = p.getUser().getId();
            r.fullName = p.getUser().getFullName();
            r.email = p.getUser().getEmail();
            r.phone = p.getPhone();
            r.location = p.getLocation();
            r.headline = p.getHeadline();
            r.summary = p.getSummary();
            r.education = p.getEducation();
            r.experience = p.getExperience();
            r.skills = p.getSkills();
            r.resumeFileName = p.getResumeFileName();
            r.updatedAt = p.getUpdatedAt();
            return r;
        }
    }
}
