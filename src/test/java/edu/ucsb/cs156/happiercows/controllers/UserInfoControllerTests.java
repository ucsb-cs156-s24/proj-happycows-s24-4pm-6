package edu.ucsb.cs156.happiercows.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.models.CurrentUser;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.mockito.Mockito.verify;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;

@WebMvcTest(controllers = UserInfoController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class UserInfoControllerTests extends ControllerTestCase {
  @Captor
  ArgumentCaptor<User> userCaptor;

  @MockBean
  UserRepository userRepository;

  @Test
  public void currentUser__logged_out() throws Exception {
    mockMvc.perform(get("/api/currentUser"))
        .andExpect(status().is(403));

    mockMvc.perform(post("/api/currentUser/last-online"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void currentUser__logged_in() throws Exception {

    
    // arrange

    CurrentUser currentUser = currentUserService.getCurrentUser();
    String expectedJson = mapper.writeValueAsString(currentUser);

    // act

    MvcResult response = mockMvc.perform(get("/api/currentUser"))
        .andExpect(status().isOk()).andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void currentUser__update_last_online() throws Exception {
    CurrentUser currentUser = currentUserService.getCurrentUser();
    Instant beforeUpdate = currentUser.getUser().getLastOnline();

    MvcResult response = mockMvc.perform(post("/api/currentUser/last-online").with(csrf()))
      .andExpect(status().isOk()).andReturn();

    assertFalse(response.getResponse().getContentAsString().isEmpty());

    verify(userRepository).save(userCaptor.capture());
    User savedUser = userCaptor.getValue();
    assertTrue(savedUser.getLastOnline().isAfter(beforeUpdate));
  }
}
