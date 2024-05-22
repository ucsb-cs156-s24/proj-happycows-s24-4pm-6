package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import edu.ucsb.cs156.happiercows.JobTestCase;
import edu.ucsb.cs156.happiercows.services.ReportService;
import edu.ucsb.cs156.happiercows.services.wiremock.WiremockService;

@RestClientTest(InstructorReportJobSingleCommonsFactory.class)
@AutoConfigureDataJpa
public class InstructorReportJobSingleCommonsFactoryTests extends JobTestCase {

    @MockBean
    ReportService reportService;
 
    @Autowired
    InstructorReportJobSingleCommonsFactory InstructorReportJobSingleCommonsFactory;

    @Test
    void test_create() throws Exception {

        // Act
        InstructorReportJobSingleCommons instructorReportJobSingleCommons = (InstructorReportJobSingleCommons) InstructorReportJobSingleCommonsFactory.create(17L);

        // Assert
        assertEquals(17L,instructorReportJobSingleCommons.getCommonsId());
        assertEquals(reportService,instructorReportJobSingleCommons.getReportService());
    }
}

