package edu.ucsb.cs156.happiercows.jobs;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.Builder;

@Builder
public class TestJob implements JobContextConsumer {

    private boolean fail;
    private int sleepMs;
    
    @Override
    public void accept(JobContext ctx) throws Exception {
            // Ensure this is not null 
            Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();

            ctx.log("Hello World! from test job!");
            if (authentication == null) {
                ctx.log("authentication is null");
            } else {
                ctx.log("authentication is not null");
            }
            Thread.sleep(sleepMs);
            if (fail) {
                throw new Exception("Fail!");
            }
            ctx.log("Goodbye from test job!");
    }
}
