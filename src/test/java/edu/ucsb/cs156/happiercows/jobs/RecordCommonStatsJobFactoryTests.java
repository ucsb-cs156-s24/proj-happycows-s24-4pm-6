package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.CommonStatsService;

@RestClientTest(RecordCommonStatsJobFactory.class)
@AutoConfigureDataJpa
public class RecordCommonStatsJobFactoryTests {

    @MockBean
    CommonStatsService commonStatsService;

    @MockBean
    CommonsRepository commonsRepository;

    @Autowired
    RecordCommonStatsJobFactory RecordCommonStatsJobFactory;

    @Test
    void test_create() throws Exception {

        // Act
        RecordCommonStatsJob recordCommonStatsJob = (RecordCommonStatsJob) RecordCommonStatsJobFactory.create();

        // Assert
        assertEquals(commonsRepository,recordCommonStatsJob.getCommonsRepository());
        assertEquals(commonStatsService,recordCommonStatsJob.getCommonStatsService());

    }
}
