package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.ReportService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class InstructorReportJobTests {

    @MockBean
    ReportService reportService;

    @MockBean
    CommonsRepository commonsRepository;

    @Test
    void test_log_output() throws Exception {

        // Arrange

        Commons commons= Commons.builder().id(17L).name("CS156").build();
        Report report = Report.builder().id(17L).build();
        
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);
      
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commons));      
        when(reportService.createReport(17L)).thenReturn(report);

        // Act
        InstructorReportJob instructorReportJob = new InstructorReportJob(reportService, commonsRepository);
        instructorReportJob.accept(ctx);

        // Assert

        verify(commonsRepository).findAll();
        verify(reportService).createReport(17L);
        
        String expected = """
            Starting instructor report...
            Starting Commons id=17 (CS156)...
            Report 17 for commons id=17 (CS156) finished.
            Instructor report done!""";

        assertEquals(expected, jobStarted.getLog());
    }
}