package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
public class MilkTheCowsJob implements JobContextConsumer {

    @Getter
    private CommonsRepository commonsRepository;
    @Getter
    private UserCommonsRepository userCommonsRepository;
    @Getter
    private UserRepository userRepository;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Starting to milk the cows");
        ctx.log("This is where the code to milk the cows will go.");
        ctx.log("Cows have been milked!");
    }
}
