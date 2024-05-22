package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;

@Service
public class MilkTheCowsJobFactoryInd {

    @Autowired
    private CommonsRepository commonsRepository;

    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfitRepository profitRepository;


    public JobContextConsumer create(Long commonsID) {
        return new MilkTheCowsJobInd(
                commonsRepository,
                userCommonsRepository,
                userRepository,
                profitRepository,
                commonsID);
    }
}
