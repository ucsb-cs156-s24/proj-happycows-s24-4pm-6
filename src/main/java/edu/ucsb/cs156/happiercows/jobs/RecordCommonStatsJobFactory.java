package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.CommonStatsService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;

@Service
public class RecordCommonStatsJobFactory {
    
    @Autowired
    private CommonsRepository commonsRepository;

    @Autowired
    private CommonStatsService commonStatsService;

    public JobContextConsumer create() {
        return new RecordCommonStatsJob(
            commonStatsService,
            commonsRepository);
    }
    
}
