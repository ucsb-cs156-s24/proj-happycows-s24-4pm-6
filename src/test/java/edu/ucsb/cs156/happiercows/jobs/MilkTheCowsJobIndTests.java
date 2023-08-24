package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class MilkTheCowsJobIndTests {
    @Mock
    CommonsRepository commonsRepository;

    @Mock
    UserCommonsRepository userCommonsRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    ProfitRepository profitRepository;

    private User user = User
            .builder()
            .id(1L)
            .fullName("Chris Gaucho")
            .email("cgaucho@example.org")
            .build();

    private Commons testCommons = Commons
            .builder()
            .name("test commons")
            .cowPrice(10)
            .milkPrice(2)
            .startingBalance(300)
            .startingDate(LocalDateTime.now())
            .carryingCapacity(100)
            .degradationRate(0.01)
            .build();

    @Test
    void error_msg_when_no_commons_found() throws Exception {

        // Arrange
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        when(commonsRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        MilkTheCowsJobInd MilkTheCowsJobInd = new MilkTheCowsJobInd(commonsRepository, userCommonsRepository,
                userRepository, profitRepository, 1L);
        MilkTheCowsJobInd.accept(ctx);

        // Assert
        String expected = """
                Starting to milk the cows
                No commons found for id 1""";
        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void test_log_output_with_commons_and_user_commons() throws Exception {

        // Arrange
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        UserCommons origUserCommons = UserCommons
                .builder()
                .user(user)
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(1)
                .cowHealth(10)
                .build();

        when(commonsRepository.findAll()).thenReturn(Arrays.asList(testCommons));
        when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                .thenReturn(Arrays.asList(origUserCommons));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(testCommons));

        // Act
        MilkTheCowsJobInd milkTheCowsJobInd = new MilkTheCowsJobInd(commonsRepository, userCommonsRepository,
                userRepository, profitRepository, 1L);
        milkTheCowsJobInd.accept(ctx);
        

        // Assert

        String expected = """
                Starting to milk the cows
                Milking cows for Commons: test commons, Milk Price: $2.00
                User: Chris Gaucho, numCows: 1, cowHealth: 10.0, totalWealth: $300.00
                Profit for user: Chris Gaucho is: $0.20, newWealth: $300.20
                Cows have been milked!""";

        assertEquals(expected, jobStarted.getLog());
    }

}
