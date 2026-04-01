package com.careercrafter.controller;

import com.careercrafter.dto.ProfileDto.*;
import com.careercrafter.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ProfileResponse> getMyProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getProfile(principal.getName()));
    }

    @PutMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ProfileResponse> saveProfile(@RequestBody ProfileRequest req, Principal principal) {
        return ResponseEntity.ok(profileService.saveProfile(req, principal.getName()));
    }

    @PostMapping("/resume")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ProfileResponse> uploadResume(@RequestParam("file") MultipartFile file,
                                                        Principal principal) throws IOException {
        return ResponseEntity.ok(profileService.uploadResume(file, principal.getName()));
    }

    @DeleteMapping("/resume")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ProfileResponse> deleteResume(Principal principal) throws IOException {
        return ResponseEntity.ok(profileService.deleteResume(principal.getName()));
    }

    @GetMapping("/resume/download/{fileName}")
    public ResponseEntity<byte[]> downloadResume(@PathVariable String fileName) throws IOException {
        byte[] data = profileService.downloadResume(fileName);
        String contentType = fileName.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(data);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }
}
