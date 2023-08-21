package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategy;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
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
            ctx.log("Commons " + commons.getName() + ", degradationRate: " + commons.getDegradationRate() + ", effectiveCapacity: " + commons.getEffectiveCapacity());
            int numUsers = commonsRepository.getNumUsers(commons.getId()).orElseThrow(() -> new RuntimeException("Error calling getNumUsers(" + commons.getId() + ")"));

            if (numUsers==0) {
                ctx.log("No users in this commons, skipping");
                continue;
            }

            int carryingCapacity = commons.getEffectiveCapacity();
            Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons.getId());

            Integer totalCows = commonsRepository.getNumCows(commons.getId()).orElseThrow(() -> new RuntimeException("Error calling getNumCows(" + commons.getId() + ")"));

            var isAboveCapacity = totalCows > carryingCapacity;
            var cowHealthUpdateStrategy = isAboveCapacity ? commons.getAboveCapacityHealthUpdateStrategy() : commons.getBelowCapacityHealthUpdateStrategy();

            for (UserCommons userCommons : allUserCommons) {
                User user = userCommons.getUser();
                var newCowHealth = calculateNewCowHealthUsingStrategy(cowHealthUpdateStrategy, commons, userCommons, totalCows);
                ctx.log("User: " + user.getFullName() + ", numCows: " + userCommons.getNumOfCows() + ", cowHealth: " + userCommons.getCowHealth());

                double oldHealth = userCommons.getCowHealth();
                userCommons.setCowHealth(newCowHealth);
                calculateCowDeaths(userCommons, ctx);

                ctx.log(" old cow health: " + oldHealth + ", new cow health: " + userCommons.getCowHealth());
                userCommonsRepository.save(userCommons);
            }
        }

        ctx.log("Cow health has been updated!");
    }

    // exposed for testing
    public static double calculateNewCowHealthUsingStrategy(
            CowHealthUpdateStrategy strategy,
            Commons commons,
            UserCommons userCommons,
            int totalCows
    ) {
        var health = strategy.calculateNewCowHealth(commons, userCommons, totalCows);
        return Math.max(0, Math.min(health, 100));
    }

    public static void calculateCowDeaths(UserCommons userCommons, JobContext ctx) {
        if (userCommons.getCowHealth() == 0.0) {
            userCommons.setCowDeaths(userCommons.getCowDeaths() + userCommons.getNumOfCows());
            userCommons.setNumOfCows(0);
            userCommons.setCowHealth(100.0);

            ctx.log(" " + userCommons.getCowDeaths() + " cows for this user died." );
        }
    }
}
