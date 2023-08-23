package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.CommonsPlusBuilderService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UpdateCowHealthJobFactoryInd  {

    @Autowired 
    private CommonsRepository commonsRepository;
  
    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommonsPlusBuilderService commonsPlusBuilderService;

    public JobContextConsumer create(Long commonsID) {
        log.info("commonsRepository = " + commonsRepository);
        log.info("userCommonsRepository = " + userCommonsRepository);
        return new UpdateCowHealthJobInd(commonsRepository, userCommonsRepository, userRepository, commonsPlusBuilderService, commonsID);
    }
}
