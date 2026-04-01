package com.careercrafter.service;

import com.careercrafter.dto.JobDto.ApplicationResponse;
import com.careercrafter.dto.SeekerDto.ApplyRequest;
import com.careercrafter.entity.*;
import com.careercrafter.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeekerService {

    private final ApplicationRepository appRepo;
    private final JobListingRepository jobRepo;
    private final UserRepository userRepo;
    private final ProfileRepository profileRepo;
    private final NotificationService notificationService;

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ApplicationResponse applyToJob(Long jobId, ApplyRequest req, String seekerEmail) {
        User seeker = getUser(seekerEmail);
        JobListing job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (job.getStatus() != JobListing.Status.OPEN) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        appRepo.findByJobAndApplicant(job, seeker).ifPresent(a -> {
            throw new RuntimeException("You have already applied to this job");
        });

        String resumeUrl = profileRepo.findByUser(seeker)
                .map(Profile::getResumeFileName)
                .orElse(null);

        Application app = Application.builder()
                .job(job)
                .applicant(seeker)
                .coverLetter(req.getCoverLetter())
                .resumeUrl(resumeUrl)
                .status(Application.Status.PENDING)
                .build();

        appRepo.save(app);

        // Notify employer
        notificationService.createNotification(
                job.getEmployer(),
                "New application received",
                seeker.getFullName() + " applied for \"" + job.getTitle() + "\".",
                "/employer/applications/" + job.getId()
        );

        // Confirm to seeker
        notificationService.createNotification(
                seeker,
                "Application submitted",
                "You successfully applied for \"" + job.getTitle() + "\" at " + job.getEmployer().getFullName() + ".",
                "/seeker/applications"
        );

        return ApplicationResponse.from(app);
    }

    public List<ApplicationResponse> getMyApplications(String seekerEmail) {
        User seeker = getUser(seekerEmail);
        return appRepo.findByApplicantOrderByAppliedAtDesc(seeker).stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    public boolean hasApplied(Long jobId, String seekerEmail) {
        User seeker = getUser(seekerEmail);
        JobListing job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return appRepo.findByJobAndApplicant(job, seeker).isPresent();
    }
}
