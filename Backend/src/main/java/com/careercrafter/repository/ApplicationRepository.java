package com.careercrafter.repository;

import com.careercrafter.entity.Application;
import com.careercrafter.entity.JobListing;
import com.careercrafter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobOrderByAppliedAtDesc(JobListing job);

    List<Application> findByApplicantOrderByAppliedAtDesc(User applicant);

    Optional<Application> findByJobAndApplicant(JobListing job, User applicant);

    long countByJob(JobListing job);

    void deleteByJob(JobListing job);
}
