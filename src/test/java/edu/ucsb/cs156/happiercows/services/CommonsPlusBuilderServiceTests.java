package edu.ucsb.cs156.happiercows.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.UserCommonsKey;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;


@ExtendWith(SpringExtension.class)
@Import(CommonsPlusBuilderService.class)
@ContextConfiguration
public class CommonsPlusBuilderServiceTests {
    @MockBean
    UserRepository userRepository;
  
    @MockBean
    CommonsRepository commonsRepository;
  
    @MockBean
    UserCommonsRepository userCommonsRepository;

    @Autowired
    CommonsPlusBuilderService commonsPlusBuilderService;

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
    
    private CommonsPlus commonsPlus = CommonsPlus
        .builder()
        .commons(commons)
        .totalCows(10)
        .totalUsers(5)
        .build();

    @Test
    void test_toCommonsPlus() {
        when(commonsRepository.getNumCows(17L)).thenReturn(Optional.of(10));
        when(commonsRepository.getNumUsers(17L)).thenReturn(Optional.of(5));
        CommonsPlus commonsPlus = commonsPlusBuilderService.toCommonsPlus(commons);
        assertEquals(commonsPlus, this.commonsPlus);
    }

    @Test
    void test_convertToCommonsPlus() {
        when(commonsRepository.getNumCows(17L)).thenReturn(Optional.of(10));
        when(commonsRepository.getNumUsers(17L)).thenReturn(Optional.of(5));
        Iterable<CommonsPlus> commonsPlusIterable = commonsPlusBuilderService.convertToCommonsPlus(Arrays.asList(commons));
        CommonsPlus commonsPlus = commonsPlusIterable.iterator().next();
        assertEquals(commonsPlus, this.commonsPlus);
    }

}
