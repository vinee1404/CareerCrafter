package com.careercrafter.service;

import com.careercrafter.dto.ProfileDto.*;
import com.careercrafter.entity.Profile;
import com.careercrafter.entity.User;
import com.careercrafter.repository.ProfileRepository;
import com.careercrafter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ProfileResponse getProfile(String email) {
        User user = getUser(email);
        Profile profile = profileRepo.findByUser(user)
                .orElseGet(() -> {
                    Profile p = Profile.builder().user(user).build();
                    return profileRepo.save(p);
                });
        return ProfileResponse.from(profile);
    }

    public ProfileResponse saveProfile(ProfileRequest req, String email) {
        User user = getUser(email);
        Profile profile = profileRepo.findByUser(user)
                .orElseGet(() -> Profile.builder().user(user).build());

        profile.setPhone(req.getPhone());
        profile.setLocation(req.getLocation());
        profile.setHeadline(req.getHeadline());
        profile.setSummary(req.getSummary());
        profile.setEducation(req.getEducation());
        profile.setExperience(req.getExperience());
        profile.setSkills(req.getSkills());

        profileRepo.save(profile);
        return ProfileResponse.from(profile);
    }

    public ProfileResponse uploadResume(MultipartFile file, String email) throws IOException {
        if (file.isEmpty()) throw new RuntimeException("File is empty");

        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf('.'))
                : ".pdf";
        String fileName = UUID.randomUUID() + ext;

        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        Files.copy(file.getInputStream(), dir.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        User user = getUser(email);
        Profile profile = profileRepo.findByUser(user)
                .orElseGet(() -> Profile.builder().user(user).build());

        
        if (profile.getResumeFileName() != null) {
            try { Files.deleteIfExists(dir.resolve(profile.getResumeFileName())); } catch (IOException ignored) {}
        }

        profile.setResumeFileName(fileName);
        profileRepo.save(profile);
        return ProfileResponse.from(profile);
    }

    public ProfileResponse deleteResume(String email) throws IOException {
        User user = getUser(email);
        Profile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (profile.getResumeFileName() != null) {
            try { Files.deleteIfExists(Paths.get(uploadDir).resolve(profile.getResumeFileName())); } catch (IOException ignored) {}
            profile.setResumeFileName(null);
            profileRepo.save(profile);
        }
        return ProfileResponse.from(profile);
    }

    public byte[] downloadResume(String fileName) throws IOException {
        Path path = Paths.get(uploadDir).resolve(fileName);
        if (!Files.exists(path)) throw new RuntimeException("File not found");
        return Files.readAllBytes(path);
    }

    public ProfileResponse getProfileByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Profile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return ProfileResponse.from(profile);
    }
}
