package edu.ucsb.cs156.happiercows.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
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
import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.ReportLine;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.UserCommonsKey;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportLineRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;

@ExtendWith(SpringExtension.class)
@Import(ReportService.class)
@ContextConfiguration
class ReportServiceTests {

  @MockBean
  UserRepository userRepository;

  @MockBean
  CommonsRepository commonsRepository;

  @MockBean
  UserCommonsRepository userCommonsRepository;

  @MockBean
  ReportRepository reportRepository;

  @MockBean
  ReportLineRepository reportLineRepository;

  @Autowired
  ReportService reportService;

  private User user = User
      .builder()
      .id(42L)
      .fullName("Chris Gaucho")
      .email("cgaucho@example.org")
      .build();

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

  UserCommons userCommons = UserCommons
      .builder()
      .user(user)
      .username("Chris Gaucho")
      .commons(commons)
      .totalWealth(300)
      .numOfCows(123)
      .cowHealth(10)
      .cowsBought(78)
      .cowsSold(23)
      .cowDeaths(6)
      .build();

  Report expectedReportHeader = Report.builder()
      .name("test commons")
      .commonsId(17L)

      .cowPrice(10)
      .milkPrice(2)
      .startingBalance(300)
      .startingDate(LocalDateTime.parse("2022-03-05T15:50:10"))
      .showLeaderboard(true)
      .carryingCapacity(100)
      .degradationRate(0.01)
      .belowCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.Linear)
      .aboveCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.Linear)
      .numCows(123)
      .numUsers(1)
      .build();

  ReportLine expectedReportLine = ReportLine.builder()
      .userId(42L)

      .username("Chris Gaucho")
      .totalWealth(300)
      .numOfCows(123)
      .avgCowHealth(10)
      .cowsBought(78)
      .cowsSold(23)
      .cowDeaths(6)
      .build();

  @BeforeEach
  void setup() {
    userCommons.setId(new UserCommonsKey(user.getId(), commons.getId()));
  }

  @Test
  void test_createAndSaveReportHeader() {
        // arrange

        when(commonsRepository.findById(17L)).thenReturn(Optional.of(commons));
        when(userCommonsRepository.findByCommonsId(commons.getId()))
                .thenReturn(Arrays.asList(userCommons));
        when(commonsRepository.getNumUsers(commons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
        when(commonsRepository.getNumCows(commons.getId())).thenReturn(Optional.of(Integer.valueOf(123)));
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));

        // act

        Report report = reportService.createAndSaveReportHeader(17L);

        // // assert

        verify(reportRepository).save(eq(expectedReportHeader));
        assertEquals(expectedReportHeader, report);
  }

  @Test
  void test_createAndSaveReportHeader_throwsException() {
        // arrange

        when(commonsRepository.findById(17L)).thenReturn(Optional.empty());

        // act / assert

        RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
            reportService.createAndSaveReportHeader(17L);
        }, "RuntimeException was expected");

        String message = thrown.getMessage();
        String expectedMessage = "Commons with id 17 not found";
        Assertions.assertTrue(message.contains(expectedMessage), String.format("Expected message to contain \"%s\" but was \"%s\"", expectedMessage, message));
  }

  @Test
  void test_createAndSaveReport() {
        // arrange

        when(commonsRepository.findById(17L)).thenReturn(Optional.of(commons));
        when(userCommonsRepository.findByCommonsId(commons.getId()))
                .thenReturn(Arrays.asList(userCommons));
        when(commonsRepository.getNumUsers(commons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
        when(commonsRepository.getNumCows(commons.getId())).thenReturn(Optional.of(Integer.valueOf(123)));
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));

        // act

        Report report = reportService.createReport(17L);

        // assert

        assertEquals(expectedReportHeader, report);
        verify(reportLineRepository).save(eq(expectedReportLine));
        verify(reportLineRepository).save(eq(expectedReportLine));
  }

  @Test
  void test_createAndSaveReportLine() {
        // arrange

        when(commonsRepository.findById(17L)).thenReturn(Optional.of(commons));
        when(userCommonsRepository.findByCommonsId(commons.getId()))
                .thenReturn(Arrays.asList(userCommons));
        when(commonsRepository.getNumUsers(commons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
        when(commonsRepository.getNumCows(commons.getId())).thenReturn(Optional.of(Integer.valueOf(123)));
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));

        // act

        ReportLine reportLine = reportService.createAndSaveReportLine(expectedReportHeader, userCommons);

        // assert

        assertEquals(expectedReportLine, reportLine);

        verify(reportLineRepository).save(eq(expectedReportLine));
  }

}
