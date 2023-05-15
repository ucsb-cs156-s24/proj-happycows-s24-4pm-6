package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import edu.ucsb.cs156.happiercows.services.jobs.JobService;
import lombok.extern.slf4j.Slf4j;

@Component("scheduledJobs")
@Slf4j
public class ScheduledJobs {

    @Autowired
    private JobService jobService;

    @Autowired
    UpdateCowHealthJobFactory updateCowHealthJobFactory;

    @Autowired
    MilkTheCowsJobFactory milkTheCowsJobFactory;
    
    @Scheduled(cron = "${app.updateCowHealth.cron}")
    public void runUpdateCowHealthJobBasedOnCron() {
       log.info("runUpdateCowHealthJobBasedOnCron: running");

       UpdateCowHealthJob updateCowHealthJob = updateCowHealthJobFactory.create();
       jobService.runAsJob(updateCowHealthJob);
    
       log.info("runUpdateCowHealthJobBasedOnCron: launched job");
    }

    // /**
    //  * A job that runs every ten seconds, as an example
    //  */

    // @Scheduled(cron = "*/10 * * * * * ")
    // public void everyTenSeconds() {
    //    log.info("everyTenSeconds: running");
    // }

    @Scheduled(cron = "${app.milkTheCows.cron}")
    public void runMilkTheCowsJobBasedOnCron() {
       log.info("runMilkTheCowsJobBasedOnCron: running");

       MilkTheCowsJob milkTheCowsJob = milkTheCowsJobFactory.create();
       jobService.runAsJob(milkTheCowsJob);
    
       log.info("runMilkTheCowsJobBasedOnCron: launched job");
    }
}
