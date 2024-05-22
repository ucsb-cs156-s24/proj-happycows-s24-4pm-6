package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonStats;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.CommonStatsService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;


/** This job computes the stats for all games in progress and creates one new row in the CommonsStats table for each commons.   It uses the Average Cow Health Service to compute the cowhealth for each commons.
*/

@AllArgsConstructor
public class RecordCommonStatsJob implements JobContextConsumer {

    @Getter
    private CommonStatsService commonStatsService;

    @Getter
    private CommonsRepository commonsRepository;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Starting record common stats job...");
        Iterable<Commons> allCommons = commonsRepository.findAll();

        for (Commons commons : allCommons) {
            ctx.log(String.format("Starting Commons id=%d (%s)...", commons.getId(), commons.getName()));
            CommonStats commonStats = commonStatsService.createAndSaveCommonStats(commons.getId());
            ctx.log(String.format("CommonStats %d for commons id=%d (%s) finished.", commonStats.getId(), commons.getId(),
                    commons.getName()));
        }
        ctx.log("Record common stats job done!");
    }
}

