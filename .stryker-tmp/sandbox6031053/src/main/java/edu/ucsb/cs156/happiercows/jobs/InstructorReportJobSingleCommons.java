package edu.ucsb.cs156.happiercows.jobs;


import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.happiercows.services.ReportService;
import lombok.AllArgsConstructor;
import lombok.Getter;

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