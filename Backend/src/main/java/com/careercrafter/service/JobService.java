package com.careercrafter.service;

import com.careercrafter.dto.JobDto.*;
import com.careercrafter.entity.JobListing;
import com.careercrafter.entity.User;
import com.careercrafter.repository.ApplicationRepository;
import com.careercrafter.repository.JobListingRepository;
import com.careercrafter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobListingRepository jobRepo;
    private final ApplicationRepository appRepo;
    private final UserRepository userRepo;

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    

    public JobResponse createJob(JobRequest req, String employerEmail) {
        User employer = getUser(employerEmail);
        JobListing job = JobListing.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .qualifications(req.getQualifications())
                .location(req.getLocation())
                .industry(req.getIndustry())
                .jobType(req.getJobType())
                .salaryRange(req.getSalaryRange())
                .status(req.getStatus())
                .employer(employer)
                .build();
        jobRepo.save(job);
        return JobResponse.from(job, 0);
    }

    

    public JobResponse updateJob(Long jobId, JobRequest req, String employerEmail) {
        JobListing job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getEmployer().getEmail().equals(employerEmail)) {
            throw new AccessDeniedException("Not your job listing");
        }
        job.setTitle(req.getTitle());
        job.setDescription(req.getDescription());
        job.setQualifications(req.getQualifications());
        job.setLocation(req.getLocation());
        job.setIndustry(req.getIndustry());
        job.setJobType(req.getJobType());
        job.setSalaryRange(req.getSalaryRange());
        job.setStatus(req.getStatus());
        jobRepo.save(job);
        return JobResponse.from(job, appRepo.countByJob(job));
    }

    // ── Employer: delete job ──────────────────────────────────────────────────

    @Transactional
    public void deleteJob(Long jobId, String employerEmail) {
        JobListing job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getEmployer().getEmail().equals(employerEmail)) {
            throw new AccessDeniedException("Not your job listing");
        }
       
        appRepo.deleteByJob(job);
        jobRepo.delete(job);
    }

  

    public List<JobResponse> getMyJobs(String employerEmail) {
        User employer = getUser(employerEmail);
        return jobRepo.findByEmployerOrderByCreatedAtDesc(employer).stream()
                .map(job -> JobResponse.from(job, appRepo.countByJob(job)))
                .collect(Collectors.toList());
    }

    

    public Page<JobResponse> searchJobs(String title, String location, String industry, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepo.search(
                (title != null && !title.isBlank()) ? title : null,
                (location != null && !location.isBlank()) ? location : null,
                (industry != null && !industry.isBlank()) ? industry : null,
                pageable
        ).map(job -> JobResponse.from(job, appRepo.countByJob(job)));
    }

   

    public JobResponse getJob(Long jobId) {
        JobListing job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return JobResponse.from(job, appRepo.countByJob(job));
    }
}
