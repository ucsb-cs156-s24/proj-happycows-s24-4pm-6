package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.services.ReportService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;

@Service
public class InstructorReportJobSingleCommonsFactory {

    @Autowired
    private ReportService reportService;

    public JobContextConsumer create(long commonsId) {
        return new InstructorReportJobSingleCommons(commonsId, reportService);
    }
  
}
