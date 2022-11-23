package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.Builder;

@Builder
public class MilkTheCowsJob implements JobContextConsumer {

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Starting to milk the cows");
        ctx.log("This is where the code to milk the cows will go.");
        ctx.log("Cows have been milked!");
    }
}
