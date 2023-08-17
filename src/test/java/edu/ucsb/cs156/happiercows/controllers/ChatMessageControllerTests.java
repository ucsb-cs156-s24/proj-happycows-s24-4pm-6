package edu.ucsb.cs156.happiercows.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.mockito.ArgumentMatchers.any;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.repositories.ChatMessageRepository;
import edu.ucsb.cs156.happiercows.entities.ChatMessage;

import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@WebMvcTest(controllers = ChatMessageController.class)
@Import(ChatMessageController.class)
@AutoConfigureDataJpa
public class ChatMessageControllerTests extends ControllerTestCase {
    
    @MockBean
    ChatMessageRepository chatMessageRepository;

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @Autowired
    ObjectMapper mapper;

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanGetAllChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).build();

        Iterable<ChatMessage> iterableOfChatMessages = Arrays.asList(chatMessage1, chatMessage2);

        when(chatMessageRepository.findAllByCommonsId(commonsId)).thenReturn(iterableOfChatMessages);

        // act
        MvcResult response = mockMvc.perform(get("/api/chat/get/all?commonsId={commonsId}", commonsId))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findAllByCommonsId(commonsId);
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(iterableOfChatMessages);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotUseGetAllAPIEndpoint() throws Exception {
        
        // arrange
        Long commonsId = 1L;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).build();

        Iterable<ChatMessage> iterableOfChatMessages = Arrays.asList(chatMessage1, chatMessage2);

        when(chatMessageRepository.findAllByCommonsId(commonsId)).thenReturn(iterableOfChatMessages);

        // act
        mockMvc.perform(get("/api/chat/get/all?commonsId={commonsId}", commonsId))
            .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(chatMessageRepository, times(0)).findAllByCommonsId(commonsId);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userInCommonsCanGetChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        Long userId = 1L;
        int page = 0;
        int size = 10;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).userId(userId).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).userId(userId).build();

        Page<ChatMessage> pageOfChatMessages = new PageImpl<ChatMessage>(Arrays.asList(chatMessage1, chatMessage2));

        when(chatMessageRepository.findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()))).thenReturn(pageOfChatMessages);
        
        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));


        // act
        MvcResult response = mockMvc.perform(get("/api/chat/get?commonsId={commonsId}&page={page}&size={size}", commonsId, page, size))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(pageOfChatMessages);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userNotInCommonsCannotGetChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        Long userId = 1L;
        int page = 0;
        int size = 10;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).userId(userId).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).userId(userId).build();

        Page<ChatMessage> pageOfChatMessages = new PageImpl<ChatMessage>(Arrays.asList(chatMessage1, chatMessage2));

        when(chatMessageRepository.findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()))).thenReturn(pageOfChatMessages);
        
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.empty());

        // act
        mockMvc.perform(get("/api/chat/get?commonsId={commonsId}&page={page}&size={size}", commonsId, page, size))
            .andExpect(status().isForbidden()).andReturn();
        
        // assert
        verify(chatMessageRepository, times(0)).findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));

    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userInCommonsCanPostChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        Long userId = 1L;
        String content = "Hello world!";

        ChatMessage chatMessage = ChatMessage.builder().id(0L).commonsId(commonsId).userId(userId).message(content).build();

        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(chatMessage);
        
        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(post("/api/chat/post?commonsId={commonsId}&content={content}", commonsId, content).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).save(any(ChatMessage.class));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(chatMessage);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }
    
    @WithMockUser(roles = {"USER"})
    @Test
    public void userNotInCommonsCannotPostChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        Long userId = 1L;
        String content = "Hello world!";

        ChatMessage chatMessage = ChatMessage.builder().id(0L).commonsId(commonsId).userId(userId).message(content).build();

        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(chatMessage);
        
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.empty());

        //act 
        mockMvc.perform(post("/api/chat/post?commonsId={commonsId}&content={content}", commonsId, content).with(csrf()))
            .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(chatMessageRepository, times(0)).save(any(ChatMessage.class));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotDeleteChatMessages() throws Exception {
        
        // arrange
        Long messageId = 0L;

        //act 
        mockMvc.perform(delete("/api/chat/delete?chatMessageId={messageId}", messageId).with(csrf()))
            .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(chatMessageRepository, times(0)).delete(any(ChatMessage.class));
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanDeleteChatMessages() throws Exception {
        
        // arrange
        Long messageId = 0L;

        ChatMessage chatMessage = ChatMessage.builder().id(messageId).build();
        when(chatMessageRepository.findById(messageId)).thenReturn(Optional.of(chatMessage));

        //act 
        MvcResult response = mockMvc.perform(delete("/api/chat/delete?chatMessageId={messageId}", messageId).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findById(messageId);
        verify(chatMessageRepository, atLeastOnce()).save(any(ChatMessage.class));
        String responseString = response.getResponse().getContentAsString();
        chatMessage.setHidden(true);
        String expectedResponseString = mapper.writeValueAsString(chatMessage);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanGetChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        Long userId = 1L;
        int page = 0;
        int size = 10;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).userId(userId).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).userId(userId).build();

        Page<ChatMessage> pageOfChatMessages = new PageImpl<ChatMessage>(Arrays.asList(chatMessage1, chatMessage2));

        when(chatMessageRepository.findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()))).thenReturn(pageOfChatMessages);
        
        // act
        MvcResult response = mockMvc.perform(get("/api/chat/get?commonsId={commonsId}&page={page}&size={size}", commonsId, page, size))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(pageOfChatMessages);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanPostChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        Long userId = 1L;
        String content = "Hello world!";

        ChatMessage chatMessage = ChatMessage.builder().id(0L).commonsId(commonsId).userId(userId).message(content).build();

        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(chatMessage);
        
        //act 
        MvcResult response = mockMvc.perform(post("/api/chat/post?commonsId={commonsId}&content={content}", commonsId, content).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).save(any(ChatMessage.class));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(chatMessage);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    // Cannot delete chat messages that don't exist
    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCannotDeleteChatMessagesThatDontExist() throws Exception {
        
        // arrange
        Long messageId = 0L;

        when(chatMessageRepository.findById(messageId)).thenReturn(Optional.empty());

        //act 
        mockMvc.perform(delete("/api/chat/delete?chatMessageId={messageId}", messageId).with(csrf()))
            .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findById(messageId);
        verify(chatMessageRepository, times(0)).save(any(ChatMessage.class));
    }


}
