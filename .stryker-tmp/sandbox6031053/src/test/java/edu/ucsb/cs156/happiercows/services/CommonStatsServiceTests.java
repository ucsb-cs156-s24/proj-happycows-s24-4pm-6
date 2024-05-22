package edu.ucsb.cs156.happiercows.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonStats;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonStatsRepository;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;

@ExtendWith(SpringExtension.class)
@Import(CommonStatsService.class)
@ContextConfiguration
public class CommonStatsServiceTests {
    
    @MockBean
    UserRepository userRepository;
  
    @MockBean
    CommonsRepository commonsRepository;
  
    @MockBean
    UserCommonsRepository userCommonsRepository;   

    @MockBean
    CommonStatsRepository commonStatsRepository;    

    @MockBean
    AverageCowHealthService averageCowHealthService;

    @Autowired
    CommonStatsService commonStatsService;

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

    CommonStats expectedStats1 = CommonStats
        .builder()
        .commonsId(17L)
        .numCows(20)
        .avgHealth(10)
        .build();

    CommonStats expectedStats2 = CommonStats
        .builder()
        .commonsId(17L)
        .numCows(120)
        .avgHealth(20)
        .build();


    @Test
    void test_saveStatsOneUser() {
        // arrange

        when(commonsRepository.findById(17L)).thenReturn(Optional.of(commons));
        when(averageCowHealthService.getAverageCowHealth(17L)).thenReturn(10.0);
        when(averageCowHealthService.getTotalNumCows(17L)).thenReturn(20);

        // act

        CommonStats stats = commonStatsService.createAndSaveCommonStats(17L);

        // assert
        verify(commonStatsRepository).save(eq(expectedStats1));
        assertEquals(expectedStats1, stats);
    }

    @Test
    void test_saveStatsMultipleUsers() {
        // arrange

        when(commonsRepository.findById(17L)).thenReturn(Optional.of(commons));
        when(averageCowHealthService.getAverageCowHealth(17L)).thenReturn(20.0);
        when(averageCowHealthService.getTotalNumCows(17L)).thenReturn(120);

        // act

        CommonStats stats = commonStatsService.createAndSaveCommonStats(17L);

        // assert
        verify(commonStatsRepository).save(eq(expectedStats2));
        assertEquals(expectedStats2, stats);
    }

    @Test
    void test_getAverageCowHealthThrowsException() {
        when(commonsRepository.findById(1L)).thenReturn(Optional.empty());

        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            commonStatsService.createAndSaveCommonStats(1L);
        });
    }
}
