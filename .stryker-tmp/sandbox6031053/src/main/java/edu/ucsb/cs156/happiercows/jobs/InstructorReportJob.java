package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.happiercows.services.ReportService;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public class InstructorReportJob implements JobContextConsumer {

    @Getter
    private ReportService reportService;

    @Getter
    private CommonsRepository commonsRepository;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Starting instructor report...");
        Iterable<Commons> allCommons = commonsRepository.findAll();

        for (Commons commons : allCommons) {
            ctx.log(String.format("Starting Commons id=%d (%s)...", commons.getId(), commons.getName()));
            Report report = reportService.createReport(commons.getId());
            ctx.log(String.format("Report %d for commons id=%d (%s) finished.", report.getId(), commons.getId(),
                    commons.getName()));
        }
        ctx.log("Instructor report done!");
    }
}