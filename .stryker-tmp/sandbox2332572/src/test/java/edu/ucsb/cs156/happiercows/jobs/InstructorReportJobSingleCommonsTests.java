package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.services.ReportService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class InstructorReportJobSingleCommonsTests {

    @MockBean
    ReportService reportService;

    @Test
    void test_log_output() throws Exception {

        // Arrange

        Report report = Report.builder().id(17L).name("Foo").build();
        
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);
      
        when(reportService.createReport(17L)).thenReturn(report);

        // Act
        InstructorReportJobSingleCommons InstructorReportJobSingleCommons = new InstructorReportJobSingleCommons(17L, reportService);
        InstructorReportJobSingleCommons.accept(ctx);

        // Assert

        verify(reportService).createReport(17L);
        
        String expected = """
            Producing instructor report for commons id: 17
            Instructor report 17 for commons Foo has been produced!""";

        assertEquals(expected, jobStarted.getLog());
    }
}