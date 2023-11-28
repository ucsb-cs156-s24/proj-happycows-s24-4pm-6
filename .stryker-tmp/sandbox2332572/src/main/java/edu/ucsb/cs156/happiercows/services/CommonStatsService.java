package edu.ucsb.cs156.happiercows.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.CommonStats;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonStatsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

@Service("CommonStatsService")
public class CommonStatsService {

    @Autowired
    CommonStatsRepository commonStatsRepository;

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Autowired
    private AverageCowHealthService averageCowHealthService;

    public CommonStats createCommonStats(Long commonsId) {

        commonsRepository.findById(commonsId)
            .orElseThrow(() -> new IllegalArgumentException(String.format("Commons with id %d not found", commonsId)));
        
        double avgHealth = averageCowHealthService.getAverageCowHealth(commonsId);
        int totalNumCows = averageCowHealthService.getTotalNumCows(commonsId);

        CommonStats stats = CommonStats.builder()
                .commonsId(commonsId)
                .numCows(totalNumCows)
                .avgHealth(avgHealth)
                .build();

        return stats;
    }

    public CommonStats createAndSaveCommonStats(Long commonsId) {
        
        CommonStats stats = createCommonStats(commonsId);
        commonStatsRepository.save(stats);

        return stats;
    }

}
