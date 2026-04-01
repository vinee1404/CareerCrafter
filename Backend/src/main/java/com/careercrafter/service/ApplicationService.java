package com.careercrafter.service;

import com.careercrafter.dto.JobDto.*;
import com.careercrafter.entity.Application;
import com.careercrafter.entity.JobListing;
import com.careercrafter.repository.ApplicationRepository;
import com.careercrafter.repository.JobListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository appRepo;
    private final JobListingRepository jobRepo;
    private final NotificationService notificationService;

      

    public List<ApplicationResponse> getApplicationsForJob(Long jobId, String employerEmail) {
        JobListing job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getEmployer().getEmail().equals(employerEmail)) {
            throw new AccessDeniedException("Not your job listing");
        }
        return appRepo.findByJobOrderByAppliedAtDesc(job).stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    

    public ApplicationResponse updateStatus(Long appId, StatusUpdateRequest req, String employerEmail) {
        Application app = appRepo.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!app.getJob().getEmployer().getEmail().equals(employerEmail)) {
            throw new AccessDeniedException("Not your job listing");
        }

        Application.Status oldStatus = app.getStatus();
        app.setStatus(req.getStatus());
        appRepo.save(app);

        
        if (!oldStatus.equals(req.getStatus())) {
            String jobTitle  = app.getJob().getTitle();
            String newStatus = req.getStatus().name();

            String title   = "Application status updated";
            String message = "Your application for \"" + jobTitle + "\" has been marked as " + newStatus + ".";
            String link    = "/seeker/applications";

            notificationService.createNotification(app.getApplicant(), title, message, link);
        }

        return ApplicationResponse.from(app);
    }
}
