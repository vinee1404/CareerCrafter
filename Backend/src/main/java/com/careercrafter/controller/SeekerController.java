package com.careercrafter.controller;

import com.careercrafter.dto.JobDto.ApplicationResponse;
import com.careercrafter.dto.SeekerDto.ApplyRequest;
import com.careercrafter.service.SeekerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seeker")
@RequiredArgsConstructor
public class SeekerController {

    private final SeekerService seekerService;

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApplicationResponse> apply(@PathVariable Long jobId,
                                                     @RequestBody ApplyRequest req,
                                                     Principal principal) {
        return ResponseEntity.ok(seekerService.applyToJob(jobId, req, principal.getName()));
    }

    @GetMapping("/applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<ApplicationResponse>> myApplications(Principal principal) {
        return ResponseEntity.ok(seekerService.getMyApplications(principal.getName()));
    }

    @GetMapping("/has-applied/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<Map<String, Boolean>> hasApplied(@PathVariable Long jobId, Principal principal) {
        boolean applied = seekerService.hasApplied(jobId, principal.getName());
        return ResponseEntity.ok(Map.of("applied", applied));
    }
}
