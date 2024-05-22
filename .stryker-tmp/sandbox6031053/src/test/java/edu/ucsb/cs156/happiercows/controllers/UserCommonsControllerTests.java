package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserCommonsController.class)
@AutoConfigureDataJpa
public class UserCommonsControllerTests extends ControllerTestCase {

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @MockBean
    UserRepository userRepository;

    @MockBean
    CommonsRepository commonsRepository;

    Commons testCommons = Commons
            .builder()
            .name("test commons")
            .cowPrice(10)
            .milkPrice(2)
            .startingBalance(300)
            .startingDate(LocalDateTime.now())
            .build();

    public UserCommons getTestUserCommons() {
        return UserCommons.builder()
                .user(currentUserService.getUser())
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(1)
                .cowHealth(100)
                .build();
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void test_getUserCommonsById_exists_admin() throws Exception {

        UserCommons expectedUserCommons = getTestUserCommons();
        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc.perform(get("/api/usercommons/?userId=1&commonsId=1"))
                .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L), eq(1L));

        String expectedJson = mapper.writeValueAsString(expectedUserCommons);
        String responseString = response.getResponse().getContentAsString();

        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void test_getUserCommonsById_nonexists_admin() throws Exception {

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(get("/api/usercommons/?userId=1&commonsId=1"))
                .andExpect(status().is(404)).andReturn();

        verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L), eq(1L));

        String expectedString = "{\"message\":\"UserCommons with commonsId 1 and userId 1 not found\",\"type\":\"EntityNotFoundException\"}";

        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_getUserCommonsById_exists() throws Exception {

        UserCommons expectedUserCommons = getTestUserCommons();
        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc.perform(get("/api/usercommons/forcurrentuser?commonsId=1"))
                .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L), eq(1L));

        String expectedJson = mapper.writeValueAsString(expectedUserCommons);
        String responseString = response.getResponse().getContentAsString();

        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_getUserCommonsById_nonexists() throws Exception {

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(get("/api/usercommons/forcurrentuser?commonsId=1"))
                .andExpect(status().is(404)).andReturn();

        verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L), eq(1L));

        String responseString = response.getResponse().getContentAsString();
        String expectedString = "{\"message\":\"UserCommons with commonsId 1 and userId 1 not found\",\"type\":\"EntityNotFoundException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_BuyCow_commons_exists() throws Exception {

        // arrange

        UserCommons origUserCommons = getTestUserCommons();
        origUserCommons.setCowsBought(1);

        UserCommons updateUserCommons = getTestUserCommons();
        updateUserCommons.setNumOfCows(3);
        updateUserCommons.setTotalWealth(300 - (testCommons.getCowPrice() * 2));
        updateUserCommons.setCowsBought(3);

        String expectedReturn = mapper.writeValueAsString(updateUserCommons);

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(origUserCommons));
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(testCommons));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/buy?commonsId=1&numCows=2")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L), eq(1L));
        verify(userCommonsRepository, times(1)).save(updateUserCommons);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedReturn, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_BuyCow_commons_exists_user_has_exact_amount_needed() throws Exception {
        // arrange

        testCommons.setCowPrice(300);

        UserCommons origUserCommons = getTestUserCommons();
        origUserCommons.setTotalWealth(300);
        origUserCommons.setNumOfCows(1);
        origUserCommons.setCowsBought(1);

        UserCommons updatedUserCommons = getTestUserCommons();
        updatedUserCommons.setTotalWealth(0);
        updatedUserCommons.setNumOfCows(2);
        updatedUserCommons.setCowsBought(2);

        String expectedReturn = mapper.writeValueAsString(updatedUserCommons);

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(origUserCommons));
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(testCommons));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/buy?commonsId=1&numCows=1")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L), eq(1L));
        verify(userCommonsRepository, times(1)).save(updatedUserCommons);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedReturn, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_SellCow_commons_exists() throws Exception {

        // arrange

        UserCommons origUserCommons = getTestUserCommons();
        origUserCommons.setCowsSold(1);
        origUserCommons.setCowHealth(50);
        origUserCommons.setNumOfCows(2);

        UserCommons updatedUserCommons = getTestUserCommons();
        updatedUserCommons.setCowHealth(50);
        updatedUserCommons.setTotalWealth(300 + (testCommons.getCowPrice() * 0.5 * 2));
        updatedUserCommons.setNumOfCows(0);
        updatedUserCommons.setCowsSold(3);

        String expectedReturn = mapper.writeValueAsString(updatedUserCommons);

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(origUserCommons));
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(testCommons));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/sell?commonsId=1&numCows=2")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L), eq(1L));
        verify(userCommonsRepository, times(1)).save(updatedUserCommons);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedReturn, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_buyCow_for_user_not_in_commons() throws Exception {
        when(commonsRepository.findById(234L)).thenReturn(Optional.of(testCommons));
        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.empty());
        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/buy?commonsId=234&numCows=2")
                        .with(csrf()))
                .andExpect(status().is(404)).andReturn();

        // assert

        String expectedString = "{\"message\":\"UserCommons with commonsId 234 and userId 1 not found\",\"type\":\"EntityNotFoundException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_sellCow_for_user_not_in_commons() throws Exception {
        when(commonsRepository.findById(234L)).thenReturn(Optional.of(testCommons));
        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/sell?commonsId=234&numCows=2")
                        .with(csrf()))
                .andExpect(status().is(404)).andReturn();

        // assert
        String expectedString = "{\"message\":\"UserCommons with commonsId 234 and userId 1 not found\",\"type\":\"EntityNotFoundException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_buyCow_commons_does_not_exist() throws Exception {
        when(commonsRepository.findById(234L)).thenReturn(Optional.empty());
        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(getTestUserCommons()));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/buy?commonsId=234&numCows=3")
                        .with(csrf()))
                .andExpect(status().is(404)).andReturn();

        // assert
        String expectedString = "{\"message\":\"Commons with id 234 not found\",\"type\":\"EntityNotFoundException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_sellCow_commons_does_not_exist() throws Exception {
        when(commonsRepository.findById(234L)).thenReturn(Optional.empty());
        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(getTestUserCommons()));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/sell?commonsId=234&numCows=3")
                        .with(csrf()))
                .andExpect(status().is(404)).andReturn();

        // assert
        String expectedString = "{\"message\":\"Commons with id 234 not found\",\"type\":\"EntityNotFoundException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }

    // Put tests for edge cases (not enough money to buy, or no cow to sell)
    @WithMockUser(roles = {"USER"})
    @Test
    public void test_BuyCow_commons_exists_not_enough_money() throws Exception {

        // arrange
        UserCommons origUserCommons = getTestUserCommons();
        origUserCommons.setTotalWealth(5);

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(origUserCommons));
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(testCommons));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/buy?commonsId=1&numCows=1")
                        .with(csrf()))
                .andExpect(status().is(400)).andReturn();

        // assert
        String expectedString = "{\"message\":\"You need more money!\",\"type\":\"NotEnoughMoneyException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_SellCow_commons_exists_no_cow_to_sell() throws Exception {

        // arrange
        UserCommons origUserCommons = getTestUserCommons();
        origUserCommons.setNumOfCows(0);

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(origUserCommons));
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(testCommons));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/sell?commonsId=1&numCows=1")
                .with(csrf())).andExpect(status().is(400)).andReturn();

        // assert
        String expectedString = "{\"message\":\"You do not have enough cows to sell!\",\"type\":\"NoCowsException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);

    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_BuyCow_not_enough_money() throws Exception {

        // arrange
        testCommons.setCowPrice(100);

        UserCommons origUserCommons = getTestUserCommons();
        origUserCommons.setCowsBought(1);
        origUserCommons.setTotalWealth(100);

        when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(origUserCommons));
        when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(testCommons));

        // act
        MvcResult response = mockMvc.perform(put("/api/usercommons/buy?commonsId=1&numCows=3")
                        .with(csrf()))
                .andExpect(status().is(400)).andReturn();

        // assert
        String expectedString = "{\"message\":\"You need more money!\",\"type\":\"NotEnoughMoneyException\"}";
        Map<String, Object> expectedJson = mapper.readValue(expectedString, Map.class);
        Map<String, Object> jsonResponse = responseToJson(response);
        assertEquals(expectedJson, jsonResponse);
    }


    @WithMockUser(roles = {"USER"})
    @Test
    public void test_getAllUserCommonsById_exists() throws Exception {
        List<UserCommons> expectedUserCommons = new ArrayList<>();
        UserCommons testexpectedUserCommons = getTestUserCommons();
        expectedUserCommons.add(testexpectedUserCommons);
        when(userCommonsRepository.findByCommonsId(eq(1L))).thenReturn(expectedUserCommons);

        MvcResult response = mockMvc.perform(get("/api/usercommons/commons/all?commonsId=1"))
                .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).findByCommonsId(eq(1L));

        String expectedJson = mapper.writeValueAsString(expectedUserCommons);
        String responseString = response.getResponse().getContentAsString();

        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void test_Admin_getAllUserCommonsById_exists() throws Exception {
        List<UserCommons> expectedUserCommons = new ArrayList<>();
        UserCommons testexpectedUserCommons = getTestUserCommons();
        expectedUserCommons.add(testexpectedUserCommons);
        when(userCommonsRepository.findByCommonsId(eq(1L))).thenReturn(expectedUserCommons);

        MvcResult response = mockMvc.perform(get("/api/usercommons/commons/all?commonsId=1").with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).findByCommonsId(eq(1L));

        String expectedJson = mapper.writeValueAsString(expectedUserCommons);
        String responseString = response.getResponse().getContentAsString();

        assertEquals(expectedJson, responseString);
    }
}
