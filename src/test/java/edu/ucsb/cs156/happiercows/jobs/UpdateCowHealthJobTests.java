package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

@Slf4j
@ExtendWith(SpringExtension.class)
@ContextConfiguration 
public class UpdateCowHealthJobTests {
    @Autowired
    UpdateCowHealthJobFactory updateCowHealthJobFactory;

    @Test
    void test_log_output() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        // Act
        UpdateCowHealthJob updateCowHealthJob = updateCowHealthJobFactory.create();
        updateCowHealthJob.accept(ctx);

        // Assert

        String expected = """
            Updating cow health
            This is where the code to update the cow health will go.
            Cow health has been updated!""";

        assertEquals(expected, jobStarted.getLog());
    }
}