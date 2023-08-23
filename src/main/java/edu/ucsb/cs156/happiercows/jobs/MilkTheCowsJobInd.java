package edu.ucsb.cs156.happiercows.jobs;


import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.Optional;

@AllArgsConstructor
public class MilkTheCowsJobInd implements JobContextConsumer {

    @Getter
    private CommonsRepository commonsRepository;
    @Getter
    private UserCommonsRepository userCommonsRepository;
    @Getter
    private UserRepository userRepository;
    @Getter
    private ProfitRepository profitRepository;
    @Getter
    private long commonsID;

    public String formatDollars(double amount) {
        return  String.format("$%.2f", amount);
    }

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Starting to milk the cows");
        Optional<Commons> commonMilkedOpt = commonsRepository.findById(commonsID);

        if(commonMilkedOpt.isPresent()){
            Commons commonMilked = commonMilkedOpt.get();
            String name = commonMilked.getName();
            double milkPrice = commonMilked.getMilkPrice();
            ctx.log("Milking cows for Commons: " + name + ", Milk Price: " + formatDollars(milkPrice));

            Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commonMilked.getId());

            for (UserCommons userCommons : allUserCommons) {
                MilkTheCowsJob.milkCows(ctx, commonMilked, userCommons, profitRepository, userCommonsRepository);
            }
            

            ctx.log("Cows have been milked!");
        } else {
            ctx.log(String.format("No commons found for id %d", commonsID));
        }
    }

}
