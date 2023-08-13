package edu.ucsb.cs156.happiercows.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonStats;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonStatsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.services.AverageCowHealthService;

@Service("CommonStatsService")
public class CommonStatsService {

    @Autowired
    CommonStatsRepository commonStatsRepository;

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Autowired
    AverageCowHealthService averageCowHealthService;

    public CommonStats createCommonStats(Long commonsId) {
        CommonStats stats = createAndSaveCommonStatsHeader(commonsId);
        
        return stats;
    }

    public CommonStats createAndSaveCommonStatsHeader(Long commonsId) {
        commonsRepository.findById(commonsId)
            .orElseThrow(() -> new RuntimeException(String.format("Commons with id %d not found", commonsId)));
        
        double avgHealth = averageCowHealthService.getAverageCowHealth(commonsId);
        int totalNumCows = averageCowHealthService.getTotalNumCows(commonsId);

        CommonStats stats = CommonStats.builder()
                .commonsId(commonsId)
                .numCows(totalNumCows)
                .avgHealth(avgHealth)
                .build();

        commonStatsRepository.save(stats);
        return stats;
    }

}
