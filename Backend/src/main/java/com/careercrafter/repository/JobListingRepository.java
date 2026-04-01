package com.careercrafter.repository;

import com.careercrafter.entity.JobListing;
import com.careercrafter.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobListingRepository extends JpaRepository<JobListing, Long> {

    List<JobListing> findByEmployerOrderByCreatedAtDesc(User employer);

    Page<JobListing> findByStatus(JobListing.Status status, Pageable pageable);

    @Query("SELECT j FROM JobListing j WHERE j.status = 'OPEN' AND " +
           "(:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:industry IS NULL OR LOWER(j.industry) LIKE LOWER(CONCAT('%', :industry, '%')))")
    Page<JobListing> search(@Param("title") String title,
                            @Param("location") String location,
                            @Param("industry") String industry,
                            Pageable pageable);
}
