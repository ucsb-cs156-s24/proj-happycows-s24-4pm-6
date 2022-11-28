package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.Builder;

@Builder
public class UpdateCowHealthJob implements JobContextConsumer {

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating cow health");
        ctx.log("This is where the code to update the cow health will go.");
        // for each commons that exists in the database:
        //     totalCows = get the total number of cows in that commons
        //     for each user in that commons:
        //         get the number of cows that user has
        //         get the average health of that users cows
        //         calculate the new health of the cows 
        //         using the formula in the stories, and assign it
        //     end for
        // end for
        ctx.log("Cow health has been updated!");
    }
}
