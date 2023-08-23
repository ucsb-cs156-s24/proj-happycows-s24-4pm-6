package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.CommonsPlusBuilderService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;
import edu.ucsb.cs156.happiercows.jobs.UpdateCowHealthJob;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class UpdateCowHealthJobIndTests {
        @Mock
        CommonsRepository commonsRepository;

        @Mock
        UserCommonsRepository userCommonsRepository;

        @Mock
        UserRepository userRepository;
        
        @Mock
        CommonsPlusBuilderService commonsPlusBuilderService;

        @Mock
        UpdateCowHealthJob updateCowHealthJob;




        private final User user = User
                        .builder()
                        .id(1L)
                        .fullName("Chris Gaucho")
                        .email("cgaucho@example.org")
                        .build();

        private final Commons commons = Commons
                        .builder()
                        .name("test commons")
                        .cowPrice(10)
                        .milkPrice(2)
                        .startingBalance(300)
                        .startingDate(LocalDateTime.now())
                        .capacityPerUser(1)
                        .carryingCapacity(100)
                        .degradationRate(1)
                        .belowCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.Noop)
                        .aboveCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.Noop)
                        .build();

        private final CommonsPlus commonsPlus = CommonsPlus
                        .builder()
                        .commons(commons)
                        .totalCows(1)
                        .totalUsers(1)
                        .build();

        private final UserCommons userCommons = UserCommons
                        .builder()
                        .user(user)
                        .commons(commons)
                        .totalWealth(300)
                        .numOfCows(1)
                        .cowHealth(10.0)
                        .build();

        private final Job job = Job.builder().build();
        private final JobContext ctx = new JobContext(null, job);

        private void runUpdateCowHealthJob() throws Exception {
                var updateCowHealthJobInd = new UpdateCowHealthJobInd(commonsRepository, userCommonsRepository,
                                userRepository, commonsPlusBuilderService, 1L);
                updateCowHealthJobInd.accept(ctx);
        }

        @Test
        void test_log_output_with_no_commons() throws Exception {
                runUpdateCowHealthJob();

                String expected = """
                                Updating cow health...
                                No commons found for id 1""";
                assertEquals(expected, job.getLog());
        }


    @Test
    void test_update_one_commons() throws Exception {
        
        List<Commons> listOfCommons = List.of(commons); 
        CommonsPlus commonsPlus = CommonsPlus.builder().commons(commons).totalCows(1).totalUsers(1).build();

        List<CommonsPlus> listOfCommonsPlus = List.of(commonsPlus);
        commons.setBelowCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.Linear);

        when(commonsRepository.findAll()).thenReturn(listOfCommons);
        when(userCommonsRepository.findByCommonsId(commons.getId())).thenReturn(List.of(userCommons));
        when(commonsRepository.getNumCows(commons.getId())).thenReturn(Optional.of(1));
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(commonsRepository.getNumUsers(commons.getId())).thenReturn(Optional.of(1));
        when(commonsPlusBuilderService.convertToCommonsPlus(eq(listOfCommons))).thenReturn(listOfCommonsPlus);
        when(commonsPlusBuilderService.toCommonsPlus(eq(commons))).thenReturn(commonsPlus);
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(commons));

        

        runUpdateCowHealthJob();

        String expected = """
                        Updating cow health...
                        Commons test commons, degradationRate: 1.0, effectiveCapacity: 100
                        User: Chris Gaucho, numCows: 1, cowHealth: 10.0
                         old cow health: 10.0, new cow health: 100.0
                        Cow health has been updated!""";

        assertEquals(expected, job.getLog());
    }

}
