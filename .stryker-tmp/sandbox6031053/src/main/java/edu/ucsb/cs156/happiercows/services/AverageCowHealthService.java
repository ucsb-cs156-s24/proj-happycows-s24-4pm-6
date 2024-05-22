package edu.ucsb.cs156.happiercows.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

@Service("AverageCowHealthService")
public class AverageCowHealthService {

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    public int getTotalNumCows(Long commonsId) {
        commonsRepository.findById(commonsId).orElseThrow(() -> new IllegalArgumentException(String.format("Commons with id %d not found", commonsId)));

        Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commonsId);

        int totalNumCows = 0;

        for (UserCommons userCommons : allUserCommons) {
            totalNumCows += userCommons.getNumOfCows();
        }

        return totalNumCows;
    }

    public double getAverageCowHealth(Long commonsId) {
        commonsRepository.findById(commonsId).orElseThrow(() -> new IllegalArgumentException(String.format("Commons with id %d not found", commonsId)));

        Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commonsId);

        double totalHealth = 0;

        for (UserCommons userCommons : allUserCommons) {
            totalHealth += userCommons.getCowHealth() * userCommons.getNumOfCows();
        }

        return totalHealth / getTotalNumCows(commonsId);
    }

    
}
