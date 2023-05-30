package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.User;

import java.time.LocalDateTime;

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
        
        @Test
        void error_msg_when_no_commons_found() throws Exception {

                // Arrange

                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                when(commonsRepository.findById(any())).thenReturn(Optional.empty());
                
                // Optional<Commons> commons = commonsRepository.findById(commonsID);
                // Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons.get().getId());

                
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
        

        @Test
        void test_updating_to_new_values_for_multiple() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons1 = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(5)
                                .cowHealth(50)
                                .build();

                UserCommons origUserCommons2 = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(5)
                                .cowHealth(50)
                                .build();

                UserCommons origUserCommons3 = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(5)
                                .cowHealth(50)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .id(117L)
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(10)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(5)
                                .cowHealth(2.0)
                                .build();

                UserCommons userCommonsTemp[] = { origUserCommons1, origUserCommons2, origUserCommons3 };
                when(commonsRepository.findById(117L)).thenReturn(Optional.of(testCommons));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
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
                assertEquals(origUserCommons1.getCowHealth(), newUserCommons.getCowHealth());
                assertEquals(origUserCommons2.getCowHealth(), newUserCommons.getCowHealth());
                assertEquals(origUserCommons3.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_throws_exception_when_getting_user_fails() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(321L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(10)
                                .build();

                Commons testCommons = Commons
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

                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findById(117L)).thenReturn(Optional.of(testCommons));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(userRepository.findById(321L)).thenReturn(Optional.empty());

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(117, 2, commonsRepository, userCommonsRepository, 
                                userRepository);

                RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
                        // Code under test
                        setCowHealthJob.accept(ctx);
                });

                Assertions.assertEquals("Error calling userRepository.findById(321)", thrown.getMessage());

        }

}