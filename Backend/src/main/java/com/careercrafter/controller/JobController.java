package com.careercrafter.controller;

import com.careercrafter.dto.JobDto.*;
import com.careercrafter.service.ApplicationService;
import com.careercrafter.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;

     

    @GetMapping
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String industry,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.searchJobs(title, location, industry, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

     

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest req, Principal principal) {
        return ResponseEntity.ok(jobService.createJob(req, principal.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id,
                                                  @Valid @RequestBody JobRequest req,
                                                  Principal principal) {
        return ResponseEntity.ok(jobService.updateJob(id, req, principal.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Principal principal) {
        jobService.deleteJob(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<JobResponse>> getMyListings(Principal principal) {
        return ResponseEntity.ok(jobService.getMyJobs(principal.getName()));
    }

    @GetMapping("/{id}/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<ApplicationResponse>> getApplications(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(id, principal.getName()));
    }

    @PutMapping("/applications/{appId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApplicationResponse> updateAppStatus(@PathVariable Long appId,
                                                                @RequestBody StatusUpdateRequest req,
                                                                Principal principal) {
        return ResponseEntity.ok(applicationService.updateStatus(appId, req, principal.getName()));
    }
}
