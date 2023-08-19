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


    //* */ get tests
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
    
    //* */ admin/get tests
    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanGetAllChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        int page = 0;
        int size = 10;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).build();

        Page<ChatMessage> pageOfChatMessages = new PageImpl<ChatMessage>(Arrays.asList(chatMessage1, chatMessage2));

        when(chatMessageRepository.findAllByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()))).thenReturn(pageOfChatMessages);

        // act
        MvcResult response = mockMvc.perform(get("/api/chat/admin/get?commonsId={commonsId}&page={page}&size={size}", commonsId, page, size))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findAllByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(pageOfChatMessages);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotUseAdminGetAPIEndpoint() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        int page = 0;
        int size = 10;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).build();

        Page<ChatMessage> pageOfChatMessages = new PageImpl<ChatMessage>(Arrays.asList(chatMessage1, chatMessage2));

        when(chatMessageRepository.findAllByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()))).thenReturn(pageOfChatMessages);

        // act
        mockMvc.perform(get("/api/chat/admin/get?commonsId={commonsId}&page={page}&size={size}", commonsId, page, size))
            .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(chatMessageRepository, times(0)).findAllByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
    }

    //* */ admin/hidden tests
    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanGetHiddenChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        int page = 0;
        int size = 10;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).hidden(true).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).hidden(true).build();

        Page<ChatMessage> pageOfChatMessages = new PageImpl<ChatMessage>(Arrays.asList(chatMessage1, chatMessage2));

        when(chatMessageRepository.findByCommonsIdAndHidden(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()))).thenReturn(pageOfChatMessages);

        // act
        MvcResult response = mockMvc.perform(get("/api/chat/admin/hidden?commonsId={commonsId}&page={page}&size={size}", commonsId, page, size))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findByCommonsIdAndHidden(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(pageOfChatMessages);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotGetHiddenChatMessages() throws Exception {
        
        // arrange
        Long commonsId = 1L;
        int page = 0;
        int size = 10;

        ChatMessage chatMessage1 = ChatMessage.builder().id(1L).commonsId(commonsId).hidden(true).build();
        ChatMessage chatMessage2 = ChatMessage.builder().id(2L).commonsId(commonsId).hidden(true).build();

        Page<ChatMessage> pageOfChatMessages = new PageImpl<ChatMessage>(Arrays.asList(chatMessage1, chatMessage2));

        when(chatMessageRepository.findByCommonsIdAndHidden(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()))).thenReturn(pageOfChatMessages);

        // act
        mockMvc.perform(get("/api/chat/admin/hidden?commonsId={commonsId}&page={page}&size={size}", commonsId, page, size))
            .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(chatMessageRepository, times(0)).findByCommonsIdAndHidden(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
    }

    //* */ post tests
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

    //* */ hide tests
    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCannotHideChatMessagesThatDontExist() throws Exception {
        
        // arrange
        Long messageId = 0L;

        when(chatMessageRepository.findById(messageId)).thenReturn(Optional.empty());

        //act 
        mockMvc.perform(put("/api/chat/hide?chatMessageId={messageId}", messageId).with(csrf()))
            .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findById(messageId);
        verify(chatMessageRepository, times(0)).save(any(ChatMessage.class));
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanHideChatMessages() throws Exception {
        
        // arrange
        Long messageId = 0L;

        ChatMessage chatMessage = ChatMessage.builder().id(messageId).build();
        when(chatMessageRepository.findById(messageId)).thenReturn(Optional.of(chatMessage));

        //act 
        MvcResult response = mockMvc.perform(put("/api/chat/hide?chatMessageId={messageId}", messageId).with(csrf()))
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

    // Users can hide messages that are their own
    @WithMockUser(roles = {"USER"})
    @Test
    public void userCanDeleteTheirOwnChatMessages() throws Exception {
        
        // arrange
        Long messageId = 0L;

        ChatMessage chatMessage = ChatMessage.builder().id(messageId).userId(1L).build();
        when(chatMessageRepository.findById(messageId)).thenReturn(Optional.of(chatMessage));

        //act 
        MvcResult response = mockMvc.perform(put("/api/chat/hide?chatMessageId={messageId}", messageId).with(csrf()))
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

    // Users cannot hide messages hat aren't their own
    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotDeleteOtherUsersChatMessages() throws Exception {
        
        // arrange
        Long messageId = 0L;

        ChatMessage chatMessage = ChatMessage.builder().id(messageId).userId(2L).build();
        when(chatMessageRepository.findById(messageId)).thenReturn(Optional.of(chatMessage));

        //act 
        mockMvc.perform(put("/api/chat/hide?chatMessageId={messageId}", messageId).with(csrf()))
            .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(chatMessageRepository, atLeastOnce()).findById(messageId);
        verify(chatMessageRepository, times(0)).save(any(ChatMessage.class));
    }
}