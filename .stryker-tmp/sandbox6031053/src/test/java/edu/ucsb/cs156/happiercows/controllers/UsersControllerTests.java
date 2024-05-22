package edu.ucsb.cs156.happiercows.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;

import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;



@WebMvcTest(controllers = UsersController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class UsersControllerTests extends ControllerTestCase {

  @MockBean
  UserRepository userRepository;

  @MockBean
  CommonsRepository commonsRepository;

  @MockBean
  UserCommonsRepository userCommonsRepository;

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
  public void getUserCommons__admin_logged_in() throws Exception {
      // arrange
      User u = User.builder().id(1L).build();
      Commons c1 = Commons.builder().id(1L).name("Commons1").build();
      Commons c2 = Commons.builder().id(2L).name("Commons2").build();

      List<Commons> expectedCommons = Arrays.asList(c1, c2);

      when(userRepository.findById(1L)).thenReturn(Optional.of(u));
      when(userCommonsRepository.findAllCommonsByUserId(1L)).thenReturn(expectedCommons);

      String expectedJson = mapper.writeValueAsString(expectedCommons);

      // act
      MvcResult response = mockMvc.perform(get("/api/admin/users/1/commons").with(csrf()))
          .andExpect(status().isOk()).andReturn();

      // assert
      verify(userRepository, times(1)).findById(1L);
      verify(userCommonsRepository, times(1)).findAllCommonsByUserId(1L);
      String responseString = response.getResponse().getContentAsString();
      assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void getUserCommons__user_not_found() throws Exception {
    // arrange
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // act
    MvcResult response = mockMvc.perform(get("/api/admin/users/1/commons").with(csrf()))
        .andExpect(status().isNotFound()).andReturn();

    // assert
    verify(userRepository, times(1)).findById(1L);
    verify(userCommonsRepository, times(0)).findAllCommonsByUserId(anyLong());
    String responseString = response.getResponse().getContentAsString();
    assertEquals("", responseString); // The response body is empty when the user is not found
  }

  
}