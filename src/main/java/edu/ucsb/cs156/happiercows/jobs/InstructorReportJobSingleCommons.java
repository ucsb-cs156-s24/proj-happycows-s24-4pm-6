package edu.ucsb.cs156.happiercows.jobs;

import java.util.Optional;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportLineRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;

import edu.ucsb.cs156.happiercows.services.ReportService;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
public class InstructorReportJobSingleCommons implements JobContextConsumer {

    @Getter
    private long commonsId;

    @Getter
    private ReportService reportService;
    
    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Producing instructor report for commons id: " + commonsId);
        Report report = reportService.createReport(commonsId);
        ctx.log(String.format("Instructor report %d for commons %s has been produced!", report.getId(), report.getName()));
    }
}