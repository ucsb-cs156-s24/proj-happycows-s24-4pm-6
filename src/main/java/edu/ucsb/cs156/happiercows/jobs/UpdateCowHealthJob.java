package edu.ucsb.cs156.happiercows.jobs;

import java.util.Optional;
import java.util.Iterator;
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

        Iterable<Commons> allCommons = commonsRepository.findAll();

        for (Commons commons : allCommons) {
            int carryingCapacity = 100;
            Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons.getId());

            // get totalCows  
            Optional<Integer> numCows = commonsRepository.getNumCows(commons.getId());
            CommonsPlus commonsPlus = CommonsPlus.builder().commons(commons).totalCows(numCows.orElse(0)).build();
            Integer totalCows = commonsPlus.getTotalCows();

            for (UserCommons userCommons : allUserCommons) {
                if (totalCows <= carryingCapacity) {
                    // increase cow health but do not exceed 100
                    userCommons.setCowHealth(Math.min(100, userCommons.getCowHealth() + (threshold*(carryingCapacity-totalCows))));
                    userCommonsRepository.save(userCommons);
                }
                else {
                    // decrease cow health, don't go lower than 0
                    userCommons.setCowHealth(Math.max(0, userCommons.getCowHealth() - Math.min((totalCows-carryingCapacity)*threshold,100)));
                    userCommonsRepository.save(userCommons);
                }
            }
        }

        ctx.log("Cow health has been updated!");
    }
    
}
