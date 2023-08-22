package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.jobs.InstructorReportJob;
import edu.ucsb.cs156.happiercows.jobs.InstructorReportJobFactory;
import edu.ucsb.cs156.happiercows.jobs.InstructorReportJobSingleCommons;
import edu.ucsb.cs156.happiercows.jobs.InstructorReportJobSingleCommonsFactory;
import edu.ucsb.cs156.happiercows.jobs.MilkTheCowsJobFactory;
import edu.ucsb.cs156.happiercows.jobs.MilkTheCowsJobFactoryInd;
import edu.ucsb.cs156.happiercows.jobs.SetCowHealthJobFactory;
import edu.ucsb.cs156.happiercows.jobs.UpdateCowHealthJobFactoryInd;
import edu.ucsb.cs156.happiercows.jobs.TestJob;
import edu.ucsb.cs156.happiercows.jobs.UpdateCowHealthJobFactory;
import edu.ucsb.cs156.happiercows.jobs.RecordCommonStatsJob;
import edu.ucsb.cs156.happiercows.jobs.RecordCommonStatsJobFactory;
import edu.ucsb.cs156.happiercows.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.happiercows.services.jobs.JobService;
import edu.ucsb.cs156.happiercows.services.CommonsPlusBuilderService;


@Tag(name = "Jobs")
@RequestMapping("/api/jobs")
@RestController
public class JobsController extends ApiController {
    @Autowired
    private JobsRepository jobsRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private CommonsPlusBuilderService commonsPlusBuilderService;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    UpdateCowHealthJobFactory updateCowHealthJobFactory;

    @Autowired
    MilkTheCowsJobFactory milkTheCowsJobFactory;

    @Autowired
    MilkTheCowsJobFactoryInd milkTheCowsJobFactoryInd;

    @Autowired
    SetCowHealthJobFactory setCowHealthJobFactory;

    @Autowired
    InstructorReportJobFactory instructorReportJobFactory;

    @Autowired
    InstructorReportJobSingleCommonsFactory instructorReportJobSingleCommonsFactory;

    @Autowired
    UpdateCowHealthJobFactoryInd updateCowHealthJobFactoryInd;

    @Autowired
    RecordCommonStatsJobFactory recordCommonStatsJobFactory;

    @Operation(summary = "List all jobs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public Iterable<Job> allJobs() {
        Iterable<Job> jobs = jobsRepository.findAll();
        return jobs;
    }

    @Operation(summary = "List all jobs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all/pageable")
    public Page<Job> allJobsPaged(
         @Parameter(name="page") @RequestParam int page,
         @Parameter(name="size") @RequestParam int size
    ) {
        Page<Job> jobs = jobsRepository.findAll(PageRequest.of(page, size, Sort.by("id").descending()));
        return jobs;
    }

    @Operation(summary = "Launch Test Job (click fail if you want to test exception handling)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/testjob")
    public Job launchTestJob(
        @Parameter(name="fail") @RequestParam Boolean fail, 
        @Parameter(name="sleepMs") @RequestParam Integer sleepMs
    ) {
        TestJob testJob = TestJob.builder()
        .fail(fail)
        .sleepMs(sleepMs)
        .build();

        // Reference: frontend/src/components/Jobs/TestJobForm.js
        if (sleepMs < 0 || sleepMs > 60000) {
            throw new IllegalArgumentException("sleepMs must be between 0 and 60000");
        }

        return jobService.runAsJob(testJob);
    }

    @Operation(summary = "Launch Job to Milk the Cows (click fail if you want to test exception handling)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/milkthecowjob")
    public Job launchTestJob(
    ) {
        JobContextConsumer milkTheCowsJob = milkTheCowsJobFactory.create();
        return jobService.runAsJob(milkTheCowsJob);
    }

    @Operation(summary = "Launch Job to Milk the Cows for a single commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/milkthecowjobsinglecommons")
    public Job launchTestJob(
         @Parameter(name="commonsId") @RequestParam Long commonsId
    ) {
        JobContextConsumer milkTheCowsJobInd = milkTheCowsJobFactoryInd.create(commonsId);
        return jobService.runAsJob(milkTheCowsJobInd);
    }

    @Operation(summary = "Launch Job to Update Cow Health")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updatecowhealth")
    public Job updateCowHealth(
    ) { 
        JobContextConsumer updateCowHealthJob = updateCowHealthJobFactory.create();
        return jobService.runAsJob(updateCowHealthJob);
    }

    @Operation(summary = "Launch Job to Update Cow Health for a single commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updatecowhealthsinglecommons")
    public Job updateCowHealth(
         @Parameter(name="commonsId") @RequestParam Long commonsId
    ) { 
        JobContextConsumer updateCowHealthJobInd = updateCowHealthJobFactoryInd.create(commonsId);
        return jobService.runAsJob(updateCowHealthJobInd);
    }

    @Operation(summary = "Launch Job to Set Cow Health")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/setcowhealth")
    public Job setCowHealth( 
        @Parameter(name="commonsID") @RequestParam Long commonsID, 
        @Parameter(name="health") @RequestParam double health
    ) { 
        JobContextConsumer setCowHealthJob = setCowHealthJobFactory.create(commonsID, health);

        // Reference: frontend/src/components/Jobs/SetCowHealthForm.js
        if (health < 0 || health > 100) {
            throw new IllegalArgumentException("health must be between 0 and 100");
        }

        return jobService.runAsJob(setCowHealthJob);
    }

    @Operation(summary = "Launch Job to Produce Instructor Report")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/instructorreport")
    public Job instructorReport(
    ) { 
        InstructorReportJob instructorReportJob = (InstructorReportJob) instructorReportJobFactory.create();
        return jobService.runAsJob(instructorReportJob);
    }

    @Operation(summary = "Launch Job to Produce Instructor Report for a single commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/instructorreportsinglecommons")
    public Job instructorReportSingleCommons(
         @Parameter(name="commonsId") @RequestParam Long commonsId
    ) { 

        InstructorReportJobSingleCommons instructorReportJobSingleCommons = (InstructorReportJobSingleCommons) instructorReportJobSingleCommonsFactory.create(commonsId);
        return jobService.runAsJob(instructorReportJobSingleCommons);
    }

    @Operation(summary = "Launch Job to Record the Stats of all Commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/recordcommonstats")
    public Job recordCommonStats(
    ) { 

        RecordCommonStatsJob recordCommonStatsJob = (RecordCommonStatsJob) recordCommonStatsJobFactory.create();
        return jobService.runAsJob(recordCommonStatsJob);
    }
}
