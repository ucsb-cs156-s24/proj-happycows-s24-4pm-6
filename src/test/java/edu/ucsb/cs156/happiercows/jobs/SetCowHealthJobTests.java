package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class SetCowHealthJobTests {
    @Mock
    CommonsRepository commonsRepository;

    @Mock
    UserCommonsRepository userCommonsRepository;

    @Mock
    UserRepository userRepository;

    private User user = User
            .builder()
            .id(1L)
            .fullName("Chris Gaucho")
            .email("cgaucho@example.org")
            .build();

    private Commons testCommons = Commons
            .builder()
            .id(117L)
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

        when(commonsRepository.findById(any())).thenReturn(Optional.empty());

        // Act
        SetCowHealthJob setCowHealthJob = new SetCowHealthJob(117L, 2.0, commonsRepository, userCommonsRepository,
                userRepository);
        setCowHealthJob.accept(ctx);

        // Assert
        String expected = """
                Setting cow health...
                No commons found for id 117""";

        assertEquals(expected, jobStarted.getLog());

    }


    UserCommons getUserCommons() {
        return UserCommons
                .builder()
                .user(user)
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(5)
                .cowHealth(50)
                .build();
    }

    @Test
    void test_updating_to_new_values_for_multiple() throws Exception {

        // Arrange
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        var userCommonsList = Arrays.asList(
                getUserCommons(),
                getUserCommons(),
                getUserCommons()
        );

        UserCommons newUserCommons = UserCommons
                .builder()
                .user(user)
                .commons(testCommons)
                .totalWealth(300 - testCommons.getCowPrice())
                .numOfCows(5)
                .cowHealth(2.0)
                .build();

        when(commonsRepository.findById(117L)).thenReturn(Optional.of(testCommons));
        when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                .thenReturn(userCommonsList);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        SetCowHealthJob setCowHealthJob = new SetCowHealthJob(117, 2, commonsRepository, userCommonsRepository,
                userRepository);
        setCowHealthJob.accept(ctx);

        // Assert

        String expected = """
                Setting cow health...
                Commons test commons
                User: Chris Gaucho, numCows: 5, cowHealth: 50.0
                 old cow health: 50.0, new cow health: 2.0
                User: Chris Gaucho, numCows: 5, cowHealth: 50.0
                 old cow health: 50.0, new cow health: 2.0
                User: Chris Gaucho, numCows: 5, cowHealth: 50.0
                 old cow health: 50.0, new cow health: 2.0
                Cow health has been set!""";

        assertEquals(expected, jobStarted.getLog());
        userCommonsList.forEach(userCommons -> assertEquals(newUserCommons.getCowHealth(), userCommons.getCowHealth()));
    }
}
