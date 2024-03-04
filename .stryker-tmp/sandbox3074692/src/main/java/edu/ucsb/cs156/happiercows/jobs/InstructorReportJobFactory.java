package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.ReportService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;

@Service
public class InstructorReportJobFactory {

    @Autowired
    private ReportService reportService;

    @Autowired
    private CommonsRepository commonsRepository;

    public JobContextConsumer create() {
        return new InstructorReportJob(reportService, commonsRepository);
    }

}
