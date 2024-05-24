package edu.ucsb.cs156.happiercows.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;

import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@WebMvcTest(controllers = UsersController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class UsersControllerTests extends ControllerTestCase {

  @MockBean
  UserRepository userRepository;

  private User user;

  @BeforeEach
  public void setUp() {
      user = User.builder()
              .id(1L)
              .email("test@example.com")
              .suspended(false)
              .build();
  }

  @Test
  public void users__logged_out() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void users__user_logged_in() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void users__admin_logged_in() throws Exception {

    
    // arrange

    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();
    User u = currentUserService.getCurrentUser().getUser();

    ArrayList<User> expectedUsers = new ArrayList<>();
    expectedUsers.addAll(Arrays.asList(u1, u2, u));

    when(userRepository.findAll()).thenReturn(expectedUsers);
    String expectedJson = mapper.writeValueAsString(expectedUsers);

    // act

    MvcResult response = mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().isOk()).andReturn();

    // assert

    verify(userRepository, times(1)).findAll();
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);

  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void testSuspendUser_success() throws Exception {
      when(userRepository.findById(1L)).thenReturn(Optional.of(user));

      MvcResult response = mockMvc.perform(post("/api/admin/users/suspend")
                      .param("userid", "1")
                      .with(csrf()))
              .andExpect(status().isOk())
              .andReturn();

      // assert
      verify(userRepository, times(1)).findById(1L);
      verify(userRepository, times(1)).save(user);
      Map<String, Object> json = responseToJson(response);
      assertEquals("User with id 1 has been suspended", json.get("message"));
      assertEquals(true, user.getSuspended());
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void testSuspendUser_notFound() throws Exception {
      when(userRepository.findById(eq(1L))).thenReturn(Optional.empty());

      MvcResult response = mockMvc.perform(post("/api/admin/users/suspend")
                      .param("userid", "1")
                      .with(csrf()))
              .andExpect(status().isNotFound())
              .andReturn();

      // assert
      verify(userRepository, times(1)).findById(1L);
      Map<String, Object> json = responseToJson(response);
      assertEquals("User with id 1 not found", json.get("message"));
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void testRestoreUser_success() throws Exception {
      user.setSuspended(true);
      when(userRepository.findById(1L)).thenReturn(Optional.of(user));

      MvcResult response = mockMvc.perform(post("/api/admin/users/restore")
                      .param("userid", "1")
                      .with(csrf()))
              .andExpect(status().isOk())
              .andReturn();

      // assert
      verify(userRepository, times(1)).findById(1L);
      verify(userRepository, times(1)).save(user);
      Map<String, Object> json = responseToJson(response);
      assertEquals("User with id 1 has been restored", json.get("message"));
      assertEquals(false, user.getSuspended());
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void testRestoreUser_notFound() throws Exception {
      when(userRepository.findById(eq(1L))).thenReturn(Optional.empty());

      MvcResult response = mockMvc.perform(post("/api/admin/users/restore")
                      .param("userid", "1")
                      .with(csrf()))
              .andExpect(status().isNotFound())
              .andReturn();

      // assert
      verify(userRepository, times(1)).findById(1L);
      Map<String, Object> json = responseToJson(response);
      assertEquals("User with id 1 not found", json.get("message"));
  }
}
