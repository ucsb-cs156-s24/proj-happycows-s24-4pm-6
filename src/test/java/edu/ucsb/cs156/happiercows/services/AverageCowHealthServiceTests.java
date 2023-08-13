package edu.ucsb.cs156.happiercows.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;


import javax.persistence.Column;
import javax.persistence.Enumerated;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


import edu.ucsb.cs156.happiercows.ControllerTestCase;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.UserCommonsKey;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;

@ExtendWith(SpringExtension.class)
@Import(AverageCowHealthService.class)
@ContextConfiguration
public class AverageCowHealthServiceTests {
    
    @MockBean
    UserRepository userRepository;
  
    @MockBean
    CommonsRepository commonsRepository;
  
    @MockBean
    UserCommonsRepository userCommonsRepository;    

    @Autowired
    AverageCowHealthService averageCowHealthService;

    private Commons commons = Commons
        .builder()
        .id(17L)
        .name("test commons")
        .cowPrice(10)
        .milkPrice(2)
        .startingBalance(300)
        .startingDate(LocalDateTime.parse("2022-03-05T15:50:10"))
        .showLeaderboard(true)
        .carryingCapacity(100)
        .degradationRate(0.01)
        .belowCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.Linear)
        .aboveCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.Linear)
        .build();

    private User user1 = User
        .builder()
        .id(42L)
        .fullName("Chris Gaucho")
        .email("cgaucho@example.org")
        .build();

    UserCommons userCommons1 = UserCommons
        .builder()
        .user(user1)
        .username("Chris Gaucho")
        .commons(commons)
        .totalWealth(300)
        .numOfCows(20)
        .cowHealth(10)
        .cowsBought(10)
        .cowsSold(23)
        .cowDeaths(6)
        .build();

    @BeforeEach
    void setup() {
      userCommons1.setId(new UserCommonsKey(user1.getId(), commons.getId()));
    }

    @Test
    void test_getAverageCowHealthOneUser() {
        when(userCommonsRepository.findByCommonsId(commons.getId())).thenReturn(Arrays.asList(userCommons1));

        assertEquals(10, averageCowHealthService.getAverageCowHealth(commons.getId()));
    }

    @Test
    void test_getAverageCowHealthMultipleUsers() {

        User user2 = User
            .builder()
            .id(43L)
            .fullName("John Doe")
            .email("jdoe@example.org")
            .build();
        UserCommons userCommons2 = UserCommons
            .builder()
            .user(user2)
            .username("John Doe")
            .commons(commons)
            .totalWealth(300)
            .numOfCows(100)
            .cowHealth(22)
            .cowsBought(20)
            .cowsSold(12)
            .cowDeaths(2)
            .build();
        userCommons2.setId(new UserCommonsKey(user2.getId(), commons.getId()));

        when(userCommonsRepository.findByCommonsId(commons.getId())).thenReturn(Arrays.asList(userCommons1, userCommons2));

        assertEquals(20, averageCowHealthService.getAverageCowHealth(commons.getId()));

    }

    @Test
    void test_getAverageCowHealthThrowsException() {
        when(userCommonsRepository.findByCommonsId(1L)).thenReturn(Arrays.asList());

        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            averageCowHealthService.getAverageCowHealth(1L);
        });
    }
}
