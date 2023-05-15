package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.parameters.P;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.http.MediaType;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;

@WebMvcTest(controllers = ProfitsController.class)
@Import(ProfitsController.class)
@AutoConfigureDataJpa
public class ProfitsControllerTests extends ControllerTestCase {
  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  ProfitRepository profitRepository;

  @MockBean
  UserCommonsRepository userCommonsRepository;

  @MockBean
  UserRepository userRepository;

  @MockBean
  CommonsRepository commonsRepository;

  UserCommons uc1 = UserCommons.builder().id(1).commonsId(2).userId(1).build();
  UserCommons uc2 = UserCommons.builder().id(2).commonsId(2).userId(2).build();

  LocalDateTime t1 = LocalDateTime.parse("2022-03-05T15:50:10");
  LocalDateTime t2 = LocalDateTime.parse("2022-03-05T15:50:11");
  LocalDateTime t3 = LocalDateTime.parse("2022-03-05T15:50:12");

  Profit p1 = Profit.builder().id(41).amount(123.45).timestamp(t1).userCommons(uc1).numCows(1).avgCowHealth(80).build();
  Profit p2 = Profit.builder().id(42).amount(543.21).timestamp(t2).userCommons(uc1).numCows(2).avgCowHealth(90).build();
  Profit p3 = Profit.builder().id(43).amount(567.89).timestamp(t3).userCommons(uc2).numCows(3).avgCowHealth(100)
      .build();

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_profits_all_commons_using_commons_id() throws Exception {
    List<Profit> expectedProfits = new ArrayList<Profit>();
    UserCommons expectedUserCommons = p1.getUserCommons();
    expectedProfits.add(p1);
    when(profitRepository.findAllByUserCommonsId(1L)).thenReturn(expectedProfits);
    when(userCommonsRepository.findByCommonsIdAndUserId(2L, 1L)).thenReturn(Optional.of(expectedUserCommons));

    MvcResult response = mockMvc.perform(get("/api/profits/all/commonsid?commonsId=2")).andDo(print())
        .andExpect(status().isOk()).andReturn();

    verify(profitRepository, times(1)).findAllByUserCommonsId(1L);

    String responseString = response.getResponse().getContentAsString();
    List<Profit> actualProfits = objectMapper.readValue(responseString, new TypeReference<List<Profit>>() {
    });
    assertEquals(actualProfits, expectedProfits);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_profits_all_commons_other_user_using_commons_id() throws Exception {
    List<Profit> expectedProfits = new ArrayList<Profit>();
    UserCommons expectedUserCommons = UserCommons.builder()
        .id(1)
        .commonsId(2)
        .userId(2).build();
    Profit p1 = Profit.builder()
        .id(42)
        .amount(543.21)
        .timestamp(LocalDateTime.parse("2022-03-05T15:50:11"))
        .userCommons(uc1)
        .numCows(2)
        .avgCowHealth(90)
        .build();
    expectedProfits.add(p1);

    when(profitRepository.findAllByUserCommonsId(1L)).thenReturn(expectedProfits);
    when(userCommonsRepository.findByCommonsIdAndUserId(2L, 1L)).thenReturn(Optional.of(expectedUserCommons));

    MvcResult response = mockMvc.perform(get("/api/profits/all/commonsid?commonsId=2").contentType("application/json"))
        .andExpect(status().isNotFound()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(2L, 1L);

    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("UserCommons with id 1 not found", json.get("message"));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_profits_all_commons_nonexistent_using_commons_id() throws Exception {
    MvcResult response = mockMvc.perform(get("/api/profits/all/commonsid?commonsId=2").contentType("application/json"))
        .andExpect(status().isNotFound()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(2L, 1L);

    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("UserCommons with commonsId 2 and userId 1 not found",
        json.get("message"));
  }

}