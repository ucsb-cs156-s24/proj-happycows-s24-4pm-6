package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UpdateCowHealthJobFactory  {

    @Autowired 
    private CommonsRepository commonsRepository;
  
    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    private UserRepository userRepository;

    public UpdateCowHealthJob create() {
        log.info("commonsRepository = " + commonsRepository);
        log.info("userCommonsRepository = " + userCommonsRepository);
        return new UpdateCowHealthJob(commonsRepository, userCommonsRepository, userRepository);
    }
}
