package edu.ucsb.cs156.happiercows.jobs;

import java.util.Optional;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Slf4j
public class UpdateCowHealthJob implements JobContextConsumer {

    @Getter private CommonsRepository commonsRepository;
    @Getter private UserCommonsRepository userCommonsRepository;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating cow health");

        double threshold = 0.01;
    //  for each commons that exists in the database:
    //      totalCows = get the total number of cows in that commons
    //      for each user in that commons:
    //          get the number of cows that user has
    //          get the average health of that users cows
    //          calculate the new health of the cows 
    //          using the formula in the stories, and assign it
    //      end for
    //  end for
        Iterable<Commons> allCommons = commonsRepository.findAll();

        for (Commons commons : allCommons) {
            try {
                int carryingCapacity = commons.getCarryingCapacity();
                Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons.getId());
                // get totalCows
                // Integer totalCows = commons.getTotalCows();       
                Optional<Integer> numCows = commonsRepository.getNumCows(commons.getId());
                CommonsPlus commonsPlus = CommonsPlus.builder().commons(commons).totalCows(numCows.orElse(0)).build();
                Integer totalCows = commonsPlus.getTotalCows();
                for (UserCommons userCommons : allUserCommons) {
                    if (totalCows <= carryingCapacity) {
                        try {
                            // increase cow health but do not exceed 100
                            userCommons.setCowHealth(Math.min(100, userCommons.getCowHealth() + (threshold*(carryingCapacity-totalCows))));
                        } catch (Exception f) {
                            ctx.log("Error updating cow health: " + f.getMessage());
                        }
                    }
                    else {
                        try {
                            // decrease cow health 
                            userCommons.setCowHealth(Math.min(0, userCommons.getCowHealth() - Math.min((totalCows-carryingCapacity)*threshold,100)));
                        } catch (Exception g) {
                            ctx.log("Error updating cow health: " + g.getMessage());
                        }
                    }
                }
            } catch (Exception e) {
                ctx.log("Error updating cow health: " + e.getMessage());
            }
        }


        ctx.log("Cow health has been updated!");
    }
    
}
