package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Iterator;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import lombok.extern.slf4j.Slf4j;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import java.time.LocalDateTime;


@ExtendWith(SpringExtension.class)
@ContextConfiguration 
public class UpdateCowHealthJobTests {
    @Mock
    CommonsRepository commonsRepository;

    @Mock
    UserCommonsRepository userCommonsRepository;

    @Test
    void test_log_output_success() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        // Act
        UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository);
        updateCowHealthJob.accept(ctx);

        // Assert
        String expected = """
            Updating cow health
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

        UserCommons userCommonsToSend = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300)
        .numOfCows(1)
        .cowHealth(10)
        .build();

        UserCommons newUserCommons = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300-testCommons.getCowPrice())
        .numOfCows(1)
        .cowHealth(10.01)
        .build();

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {origUserCommons};
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId())).thenReturn(Arrays.asList(userCommonsTemp));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));

        // Act
        UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository);
        updateCowHealthJob.accept(ctx);

        // Assert

        String expected = """
            Updating cow health
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

        UserCommons userCommonsToSend = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300)
        .numOfCows(101)
        .cowHealth(100)
        .build();

        UserCommons newUserCommons = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300-testCommons.getCowPrice())
        .numOfCows(101)
        .cowHealth(99.99)
        .build();

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {origUserCommons};
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId())).thenReturn(Arrays.asList(userCommonsTemp));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(101)));

        // Act
        UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository);
        updateCowHealthJob.accept(ctx);

        // Assert

        String expected = """
            Updating cow health
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

        UserCommons userCommonsToSend = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300)
        .numOfCows(100)
        .cowHealth(50)
        .build();

        UserCommons newUserCommons = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300-testCommons.getCowPrice())
        .numOfCows(100)
        .cowHealth(50.01)
        .build();

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {origUserCommons};
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId())).thenReturn(Arrays.asList(userCommonsTemp));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(100)));

        // Act
        UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository);
        updateCowHealthJob.accept(ctx);

        // Assert

        String expected = """
            Updating cow health
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

        UserCommons userCommonsToSend = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300)
        .numOfCows(150)
        .cowHealth(0)
        .build();

        UserCommons newUserCommons = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300-testCommons.getCowPrice())
        .numOfCows(150)
        .cowHealth(0)
        .build();

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {origUserCommons};
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId())).thenReturn(Arrays.asList(userCommonsTemp));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(150)));

        // Act
        UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository);
        updateCowHealthJob.accept(ctx);

        // Assert

        String expected = """
            Updating cow health
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

        UserCommons userCommonsToSend = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300)
        .numOfCows(1)
        .cowHealth(100)
        .build();

        UserCommons newUserCommons = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300-testCommons.getCowPrice())
        .numOfCows(1)
        .cowHealth(100)
        .build();

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {origUserCommons};
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId())).thenReturn(Arrays.asList(userCommonsTemp));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));

        // Act
        UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository);
        updateCowHealthJob.accept(ctx);

        // Assert

        String expected = """
            Updating cow health
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

        UserCommons userCommonsToSend = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300)
        .numOfCows(5)
        .cowHealth(50)
        .build();

        UserCommons newUserCommons = UserCommons
        .builder()
        .id(1L)
        .userId(1L)
        .commonsId(1L)
        .totalWealth(300-testCommons.getCowPrice())
        .numOfCows(5)
        .cowHealth(50.01)
        .build();

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {origUserCommons1, origUserCommons2, origUserCommons3};
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId())).thenReturn(Arrays.asList(userCommonsTemp));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));

        // Act
        UpdateCowHealthJob updateCowHealthJob = new UpdateCowHealthJob(commonsRepository, userCommonsRepository);
        updateCowHealthJob.accept(ctx);

        // Assert

        String expected = """
            Updating cow health
            Cow health has been updated!""";

        assertEquals(expected, jobStarted.getLog());
        assertEquals(origUserCommons1.getCowHealth(), newUserCommons.getCowHealth());
        assertEquals(origUserCommons2.getCowHealth(), newUserCommons.getCowHealth());
        assertEquals(origUserCommons3.getCowHealth(), newUserCommons.getCowHealth());
    }


}