package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.ReportLine;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportLineRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ReportsController.class)
@Import(ReportsController.class)
@AutoConfigureDataJpa
public class ReportsControllerTests extends ControllerTestCase {
        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        ReportRepository reportRepository;

        @MockBean
        ReportLineRepository reportLineRepository;

        @MockBean
        UserCommonsRepository userCommonsRepository;

        @MockBean
        UserRepository userRepository;

        @MockBean
        CommonsRepository commonsRepository;

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
                        .id(432L)
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
                        .reportId(432L)
                        .username("Chris Gaucho")
                        .totalWealth(300)
                        .numOfCows(123)
                        .avgCowHealth(10)
                        .cowsBought(78)
                        .cowsSold(23)
                        .cowDeaths(6)
                        .build();


        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void get_all_report_headers() throws Exception {
                List<Report> reports = List.of(expectedReportHeader);
                when(reportRepository.findAll(any())).thenReturn(reports);
               
                MvcResult response = mockMvc.perform(get("/api/reports")).andDo(print())
                                .andExpect(status().isOk()).andReturn();

                verify(reportRepository, times(1)).findAll(any());

                String responseString = response.getResponse().getContentAsString();
                List<Report> actualReports = objectMapper.readValue(responseString, new TypeReference<List<Report>>() {
                });
                assertEquals(reports, actualReports);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void get_specific_report_header() throws Exception {
                Optional<Report> optionalReport = Optional.of(expectedReportHeader);
                when(reportRepository.findById(eq(432L))).thenReturn(optionalReport);
               
                MvcResult response = mockMvc.perform(get("/api/reports/byReportId?reportId=432")).andDo(print())
                                .andExpect(status().isOk()).andReturn();

                verify(reportRepository, times(1)).findById(eq(432L));

                String responseString = response.getResponse().getContentAsString();
                Optional<Report> actualReports = objectMapper.readValue(responseString, new TypeReference<Optional<Report>>() {
                });
                assertEquals(optionalReport, actualReports);
        }
                        
        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void get_reports_headers_commonId() throws Exception {
                List<Report> reports = List.of(expectedReportHeader);
                when(reportRepository.findAllByCommonsId(17L)).thenReturn(reports);
               
                MvcResult response = mockMvc.perform(get("/api/reports/headers?commonsId=17")).andDo(print())
                                .andExpect(status().isOk()).andReturn();

                verify(reportRepository, times(1)).findAllByCommonsId(eq(17L));

                String responseString = response.getResponse().getContentAsString();
                List<Report> actualReports = objectMapper.readValue(responseString, new TypeReference<List<Report>>() {
                });
                assertEquals(reports, actualReports);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void get_reports_lines_commonId() throws Exception {
                List<ReportLine> lines = List.of(expectedReportLine);
                when(reportLineRepository.findAllByReportId(432L)).thenReturn(List.of(expectedReportLine));
               
                MvcResult response = mockMvc.perform(get("/api/reports/lines?reportId=432")).andDo(print())
                                .andExpect(status().isOk()).andReturn();

                verify(reportLineRepository, times(1)).findAllByReportId(eq(432L));

                String responseString = response.getResponse().getContentAsString();
                List<ReportLine> actualLines = objectMapper.readValue(responseString, new TypeReference<List<ReportLine>>() {
                });
                assertEquals(lines, actualLines);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void test_get_csv() throws Exception {
                when(reportLineRepository.findAllByReportId(432L)).thenReturn(List.of(expectedReportLine));
               
                MvcResult response = mockMvc.perform(get("/api/reports/download?reportId=432")).andDo(print())
                                .andExpect(status().isOk()).andReturn();

                verify(reportLineRepository, times(1)).findAllByReportId(eq(432L));
                String responseString = response.getResponse().getContentAsString();

                assertEquals("application/csv", response.getResponse().getContentType());

                String expected = 
                        "id,reportId,userId,username,totalWealth,numOfCows,avgCowHealth,cowsBought,cowsSold,cowDeaths,reportDate\r\n" +
                        "0,432,42,Chris Gaucho,300.0,123,10.0,78,23,6,null\r\n";
                                         
                assertEquals(expected, responseString);
        }


}
