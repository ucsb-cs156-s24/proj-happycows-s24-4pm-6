package edu.ucsb.cs156.happiercows.jobs;

import java.util.Optional;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.CommonsPlusBuilderService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public class UpdateCowHealthJobInd implements JobContextConsumer {

    @Getter
    private CommonsRepository commonsRepository;
    @Getter
    private UserCommonsRepository userCommonsRepository;
    @Getter
    private UserRepository userRepository;
    @Getter
    private CommonsPlusBuilderService commonsPlusBuilderService;
    @Getter
    private Long commonsID;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating cow health...");

       Optional<Commons> commonUpdatedOpt = commonsRepository.findById(commonsID);


        if(commonUpdatedOpt.isPresent()){
            Commons commonsUpdated = commonUpdatedOpt.get();
            CommonsPlus commonsPlus = commonsPlusBuilderService.toCommonsPlus(commonsUpdated);
            UpdateCowHealthJob.runUpdateJobInCommons(commonsUpdated, commonsPlus, commonsPlusBuilderService, commonsRepository, userCommonsRepository, ctx); 
            ctx.log("Cow health has been updated!");
        } else {
            ctx.log(String.format("No commons found for id %d", commonsID));
        }
    }
    
}
