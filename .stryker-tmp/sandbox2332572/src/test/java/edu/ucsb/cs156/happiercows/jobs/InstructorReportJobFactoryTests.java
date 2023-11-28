package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.ReportService;

@RestClientTest(InstructorReportJobFactory.class)
@AutoConfigureDataJpa
public class InstructorReportJobFactoryTests {

    @MockBean
    ReportService reportService;

    @MockBean
    CommonsRepository commonsRepository;

    @Autowired
    InstructorReportJobFactory InstructorReportJobFactory;

    @Test
    void test_create() throws Exception {

        // Act
        InstructorReportJob InstructorReportJob = (InstructorReportJob) InstructorReportJobFactory.create();

        // Assert
        assertEquals(reportService,InstructorReportJob.getReportService());
        assertEquals(commonsRepository,InstructorReportJob.getCommonsRepository());
       
    }
}

