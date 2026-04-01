package com.careercrafter.dto;

import com.careercrafter.entity.Application;
import com.careercrafter.entity.JobListing;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class JobDto {

    @Data
    public static class JobRequest {
        @NotBlank
        private String title;

        @NotBlank
        private String description;

        @NotBlank
        private String qualifications;

        @NotBlank
        private String location;

        @NotBlank
        private String industry;

        @NotBlank
        private String jobType;

        private String salaryRange;

        @NotNull
        private JobListing.Status status;
    }

    @Data
    public static class JobResponse {
        private Long id;
        private String title;
        private String description;
        private String qualifications;
        private String location;
        private String industry;
        private String jobType;
        private String salaryRange;
        private String status;
        private Long employerId;
        private String employerName;
        private LocalDateTime createdAt;
        private long applicationCount;

        public static JobResponse from(JobListing job, long applicationCount) {
            JobResponse r = new JobResponse();
            r.id = job.getId();
            r.title = job.getTitle();
            r.description = job.getDescription();
            r.qualifications = job.getQualifications();
            r.location = job.getLocation();
            r.industry = job.getIndustry();
            r.jobType = job.getJobType();
            r.salaryRange = job.getSalaryRange();
            r.status = job.getStatus().name();
            r.employerId = job.getEmployer().getId();
            r.employerName = job.getEmployer().getFullName();
            r.createdAt = job.getCreatedAt();
            r.applicationCount = applicationCount;
            return r;
        }
    }

    @Data
    public static class ApplicationResponse {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private Long applicantId;
        private String applicantName;
        private String applicantEmail;
        private String coverLetter;
        private String resumeUrl;
        private String status;
        private LocalDateTime appliedAt;

        public static ApplicationResponse from(Application app) {
            ApplicationResponse r = new ApplicationResponse();
            r.id = app.getId();
            r.jobId = app.getJob().getId();
            r.jobTitle = app.getJob().getTitle();
            r.applicantId = app.getApplicant().getId();
            r.applicantName = app.getApplicant().getFullName();
            r.applicantEmail = app.getApplicant().getEmail();
            r.coverLetter = app.getCoverLetter();
            r.resumeUrl = app.getResumeUrl();
            r.status = app.getStatus().name();
            r.appliedAt = app.getAppliedAt();
            return r;
        }
    }

    @Data
    public static class StatusUpdateRequest {
        @NotNull
        private Application.Status status;
    }
}
