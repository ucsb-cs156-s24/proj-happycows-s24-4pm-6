package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
public class UpdateCowHealthJobTests {
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
        void test_log_output_success() throws Exception {

                // Arrange

                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);
                updateCowHealthJob.accept(ctx);

                // Assert
                String expected = """
                                Updating cow health...
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
        }

        @Test
        void test_updating_to_new_values_if_less_than_carrying_capacity() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(10)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(1)
                                .cowHealth(10.01)
                                .build();

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);
                updateCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 1, cowHealth: 10.0
                                 old cow health: 10.0, new cow health: 10.01
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_updating_to_new_values_if_greater_than_carrying_capacity() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(101)
                                .cowHealth(100)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(101)
                                .cowHealth(99.99)
                                .build();

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(101)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);
                updateCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 101, cowHealth: 100.0
                                 old cow health: 100.0, new cow health: 99.99
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_updating_to_new_values_if_equal_to_carrying_capacity() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(100)
                                .cowHealth(50)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(100)
                                .cowHealth(50.01)
                                .build();

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(100)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);
                updateCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 100, cowHealth: 50.0
                                 old cow health: 50.0, new cow health: 50.01
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_updating_to_new_values_health_lower_than_zero() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(150)
                                .cowHealth(0)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(150)
                                .cowHealth(0)
                                .build();

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(150)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);
                updateCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 150, cowHealth: 0.0
                                 old cow health: 0.0, new cow health: 0.0
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_updating_to_new_values_health_greater_than_100() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(100)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(1)
                                .cowHealth(100)
                                .build();

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);
                updateCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 1, cowHealth: 100.0
                                 old cow health: 100.0, new cow health: 100.0
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
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
                                .cowHealth(50.01)
                                .build();

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons1, origUserCommons2, origUserCommons3 };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);
                updateCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 10
                                User: Chris Gaucho, numCows: 5, cowHealth: 50.0
                                 old cow health: 50.0, new cow health: 50.01
                                User: Chris Gaucho, numCows: 5, cowHealth: 50.0
                                 old cow health: 50.0, new cow health: 50.01
                                User: Chris Gaucho, numCows: 5, cowHealth: 50.0
                                 old cow health: 50.0, new cow health: 50.01
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons1.getCowHealth(), newUserCommons.getCowHealth());
                assertEquals(origUserCommons2.getCowHealth(), newUserCommons.getCowHealth());
                assertEquals(origUserCommons3.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_throws_exception_when_get_num_cows_fails() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
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

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.empty());
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);

                RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
                        // Code under test
                        updateCowHealthJob.accept(ctx);
                });

                Assertions.assertEquals("Error calling getNumCows(117)", thrown.getMessage());

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

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(10));
                when(userRepository.findById(321L)).thenReturn(Optional.empty());

                // Act
                UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository);

                RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
                        // Code under test
                        updateCowHealthJob.accept(ctx);
                });

                Assertions.assertEquals("Error calling userRepository.findById(321)", thrown.getMessage());

        }

        @Test
        void test_calculateNewCowHealth__numCows_lt_carryingCapacity_old_health_at_100__no_change() {
             
                // arrange
              
                double oldCowHealth = 100.0;
                int numCows = 50;
                int totalCows = 80;
                int carryingCapacity = 100;
                double degradationRate = 3.0;

                // act

                double newCowHealth = UpdateCowHealthJob.calculateNewCowHealth(oldCowHealth, numCows, totalCows,
                                carryingCapacity, degradationRate);

                // assert

                assertEquals(100.0, newCowHealth);

        }

        @Test
        void test_calculateNewCowHealth__numCows_lt_carryingCapacity_old_health_at_80__goes_up() {
             
                // arrange
              
                double oldCowHealth = 80.123;
                int numCows = 50;
                int totalCows = 80;
                int carryingCapacity = 100;
                double degradationRate = 3.456;

                // act

                double newCowHealth = UpdateCowHealthJob.calculateNewCowHealth(oldCowHealth, numCows, totalCows,
                                carryingCapacity, degradationRate);

                // assert

                assertEquals(83.579, newCowHealth, 0.0001);

        }

        @Test
        void test_calculateNewCowHealth__numCows_one_over_carryingCapacity_old_health_at_80__goes_down_by_degradation_rate() {
             
                // arrange
              
                double oldCowHealth = 83.579;
                int numCows = 50;
                int totalCows = 101;
                int carryingCapacity = 100;
                double degradationRate = 3.456;

                // act

                double newCowHealth = UpdateCowHealthJob.calculateNewCowHealth(oldCowHealth, numCows, totalCows,
                                carryingCapacity, degradationRate);

                // assert

                assertEquals(80.123, newCowHealth, 0.0001);

        }

        @Test
        void test_calculateNewCowHealth__numCows_ten_over_carryingCapacity_old_health_at_80__goes_down_by_degradation_rate_times_10() {
             
                // arrange
              
                double oldCowHealth = 100.0;
                int numCows = 50;
                int totalCows = 110;
                int carryingCapacity = 100;
                double degradationRate = 1.234;

                // act

                double newCowHealth = UpdateCowHealthJob.calculateNewCowHealth(oldCowHealth, numCows, totalCows,
                                carryingCapacity, degradationRate);

                // assert

                assertEquals((100.0 - 12.34), newCowHealth, 0.0001);

        }

}