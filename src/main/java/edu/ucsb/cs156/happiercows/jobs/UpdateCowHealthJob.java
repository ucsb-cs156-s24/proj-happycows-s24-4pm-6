package edu.ucsb.cs156.happiercows.jobs;

import java.util.Optional;


import java.util.Iterator;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Slf4j
public class UpdateCowHealthJob implements JobContextConsumer {

    @Getter
    private CommonsRepository commonsRepository;
    @Getter
    private UserCommonsRepository userCommonsRepository;
    @Getter
    private UserRepository userRepository;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating cow health...");

        Iterable<Commons> allCommons = commonsRepository.findAll();

        for (Commons commons : allCommons) {
            ctx.log("Commons " + commons.getName() + ", degradationRate: " + commons.getDegradationRate() + ", carryingCapacity: " + commons.getCarryingCapacity());

            int carryingCapacity = commons.getCarryingCapacity();
            double degradationRate = commons.getDegradationRate();
            Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons.getId());

            Integer totalCows = commonsRepository.getNumCows(commons.getId()).orElseThrow(()->new RuntimeException("Error calling getNumCows(" + commons.getId() + ")"));

            for (UserCommons userCommons : allUserCommons) {
                User user = userRepository.findById(userCommons.getUserId()).orElseThrow(()->new RuntimeException("Error calling userRepository.findById(" + userCommons.getUserId() + ")"));
                ctx.log("User: " + user.getFullName() + ", numCows: " + userCommons.getNumOfCows() + ", cowHealth: " + userCommons.getCowHealth());

                double newCowHealth = calculateNewCowHealth(userCommons.getCowHealth(), userCommons.getNumOfCows(), totalCows, carryingCapacity, degradationRate);
                ctx.log(" old cow health: " + userCommons.getCowHealth() + ", new cow health: " + newCowHealth);
                userCommons.setCowHealth(newCowHealth);
                userCommonsRepository.save(userCommons);
            }
        }

        ctx.log("Cow health has been updated!");
    }

    public static double calculateNewCowHealth(
            double oldCowHealth,
            int numCows,
            int totalCows,
            int carryingCapacity,
            double degradationRate) {
        if (totalCows <= carryingCapacity) {
            // increase cow health but do not exceed 100
            return Math.min(100, oldCowHealth + (degradationRate));
        } else {
            // decrease cow health, don't go lower than 0
            return Math.max(0, oldCowHealth - Math.min((totalCows - carryingCapacity) * degradationRate, 100));
        }
    }

}
