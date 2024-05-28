package edu.ucsb.cs156.happiercows.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.mockito.ArgumentMatchers.any;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.TimeZone;


import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.repositories.AnnouncementRepository;
import edu.ucsb.cs156.happiercows.entities.Announcement;

import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@WebMvcTest(controllers = AnnouncementsController.class)
@Import(AnnouncementsController.class)
@AutoConfigureDataJpa
public class AnnouncementsControllerTests extends ControllerTestCase {

    @MockBean
    AnnouncementRepository announcementRepository;

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @Autowired
    ObjectMapper mapper;


    //* */ post tests
    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanPostAnnouncements() throws Exception {

        // arrange
        Long commonsId = 1L;
        Long id = 0L;
        Long userId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");
        Date end = sdf.parse("2025-03-03T17:39:43.000-08:00");


        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).endDate(end).announcementText(announcement).build();

        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcementObj);

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.empty());

        //act 
        MvcResult response = mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&startDate={start}&endDate={end}&announcementText={announcement}", commonsId, start, end, announcement).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).save(any(Announcement.class));
        String announcementString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementObj);
        log.info("Got back from API: {}",announcementString);
        assertEquals(expectedResponseString, announcementString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userInCommonsCanPostAnnouncements() throws Exception {

        // arrange
        Long commonsId = 1L;
        Long id = 0L;
        Long userId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");


        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();

        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcementObj);

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&startDate={start}&announcementText={announcement}", commonsId, start, announcement).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).save(any(Announcement.class));
        String announcementString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementObj);
        log.info("Got back from API: {}",announcementString);
        assertEquals(expectedResponseString, announcementString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCanPostAnnouncementWithoutStartAndEndTime() throws Exception {

        // arrange
        Long commonsId = 1L;
        Long id = 0L;
        Long userId = 1L;
        String announcement = "Hello world!";

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).announcementText(announcement).build();

        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcementObj);

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&announcementText={announcement}", commonsId, announcement).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).save(any(Announcement.class));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotPostAnnouncementWithEmptyString() throws Exception {

        // arrange
        Long commonsId = 1L;
        Long id = 0L;
        Long userId = 1L;
        String announcement = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();

        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcementObj);

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&startDate={start}&announcementText={announcement}", commonsId, start, announcement).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, times(0)).save(any(Announcement.class));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotPostAnnouncementWithEndBeforeStart() throws Exception {

        // arrange
        Long commonsId = 1L;
        Long id = 0L;
        Long userId = 1L;
        String announcement = "Announcement";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");
        Date end = sdf.parse("2022-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).endDate(end).announcementText(announcement).build();

        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcementObj);

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&startDate={start}&endDate={end}&announcementText={announcement}", commonsId, start, end, announcement).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, times(0)).save(any(Announcement.class));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userNotInCommonsCannotPostAnnouncements() throws Exception {

        // arrange
        Long commonsId = 1L;
        Long id = 0L;
        Long userId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();

        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcementObj);

        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.empty());

        //act 
        mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&startDate={start}&announcementText={announcement}", commonsId, start, announcement).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, times(0)).save(any(Announcement.class));
    }

    //* */ hide tests
    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCannotDeleteAnnouncementsThatDontExist() throws Exception {

        // arrange
        Long id = 0L;

        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.empty());

        //act 
        mockMvc.perform(delete("/api/announcements/delete?id={id}", id).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
        verify(announcementRepository, times(0)).delete(any(Announcement.class));
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanDeleteAnnouncements() throws Exception {

        // arrange
        Long commonsId = 1L;
        Long id = 0L;
        Long userId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");


        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        //act 
        MvcResult response = mockMvc.perform(delete("/api/announcements/delete?id={id}", id).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
        verify(announcementRepository, atLeastOnce()).delete(any(Announcement.class));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementObj);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCanGetAllAnnouncements() throws Exception {

        // arrange
        Long id1 = 0L;
        Long id2 = 1L;
        Long commonsId = 1L;
        Long userId = 1L;
        String announcement1 = "Hello world!";
        String announcement2 = "Hello world2!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj1 = Announcement.builder().id(id1).commonsId(commonsId).startDate(start).announcementText(announcement1).build();
        Announcement announcementObj2 = Announcement.builder().id(id2).commonsId(commonsId).startDate(start).announcementText(announcement2).build();
        List<Announcement> announcementList = new ArrayList<> ();
        announcementList.add(announcementObj1);
        announcementList.add(announcementObj2);
        Pageable pageable = PageRequest.of(0, 1000, Sort.by("startDate").descending());
        Page<Announcement> announcementPage = new PageImpl<Announcement>(announcementList, pageable, 2);

        when(announcementRepository.findByCommonsId(commonsId, pageable)).thenReturn(announcementPage);

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(get("/api/announcements/all?commonsId={commonsId}", commonsId))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByCommonsId(commonsId, pageable);
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementPage.getContent());
        assertEquals(expectedResponseString, responseString);
    }


    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotGetAllAnnouncementsIfNotInCommons() throws Exception {

        // arrange
        Long id1 = 0L;
        Long id2 = 1L;
        Long commonsId = 1L;
        Long userId = 1L;
        String announcement1 = "Hello world!";
        String announcement2 = "Hello world2!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj1 = Announcement.builder().id(id1).commonsId(commonsId).startDate(start).announcementText(announcement1).build();
        Announcement announcementObj2 = Announcement.builder().id(id2).commonsId(commonsId).startDate(start).announcementText(announcement2).build();
        List<Announcement> announcementList = new ArrayList<> ();
        announcementList.add(announcementObj1);
        announcementList.add(announcementObj2);
        Pageable pageable = PageRequest.of(0, 1000, Sort.by("startDate").descending());
        Page<Announcement> announcementPage = new PageImpl<Announcement>(announcementList, pageable, 2);

        when(announcementRepository.findByCommonsId(commonsId, pageable)).thenReturn(announcementPage);

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.empty());

        //act 
        MvcResult response = mockMvc.perform(get("/api/announcements/all?commonsId={commonsId}", commonsId))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, times(0)).findByCommonsId(commonsId, pageable);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanGetAllAnnouncements() throws Exception {

        // arrange
        Long id1 = 0L;
        Long id2 = 1L;
        Long commonsId = 1L;
        String announcement1 = "Hello world!";
        String announcement2 = "Hello world2!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj1 = Announcement.builder().id(id1).commonsId(commonsId).startDate(start).announcementText(announcement1).build();
        Announcement announcementObj2 = Announcement.builder().id(id2).commonsId(commonsId).startDate(start).announcementText(announcement2).build();
        List<Announcement> announcementList = new ArrayList<> ();
        announcementList.add(announcementObj1);
        announcementList.add(announcementObj2);
        Pageable pageable = PageRequest.of(0, 1000, Sort.by("startDate").descending());
        Page<Announcement> announcementPage = new PageImpl<Announcement>(announcementList, pageable, 2);

        when(announcementRepository.findByCommonsId(commonsId, pageable)).thenReturn(announcementPage);

        //act 
        MvcResult response = mockMvc.perform(get("/api/announcements/all?commonsId={commonsId}", commonsId))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByCommonsId(commonsId, pageable);
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementPage.getContent());
        assertEquals(expectedResponseString, responseString);
    }


    @WithMockUser(roles = {"USER"})
    @Test
    public void userCanGetAnnouncementById() throws Exception {

        // arrange
        Long id = 0L;
        Long commonsId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        //act 
        MvcResult response = mockMvc.perform(get("/api/announcements/getbyid?id={id}", id))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementObj);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotGetAnnouncementByIdThatDoesNotExist() throws Exception {
        Long id = 0L;

        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.empty());

        //act 
        MvcResult response = mockMvc.perform(get("/api/announcements/getbyid?id={id}", id))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
    }


    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanEditAnnouncement() throws Exception {


        Long id = 0L;
        Long commonsId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        //act 
        MvcResult response = mockMvc.perform(get("/api/announcements/getbyid?id={id}", id))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementObj);
        assertEquals(expectedResponseString, responseString);


        // arrange
        String editedAnnouncement = "Hello world edited!";
        Date editedStart = sdf.parse("2023-03-03T17:39:43.000-08:00");
        Date editedEnd = sdf.parse("2025-03-03T17:39:43.000-08:00");

        Announcement editedAnnouncementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(editedStart).endDate(editedEnd).announcementText(editedAnnouncement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        //act 
        MvcResult editedResponse = mockMvc.perform(put("/api/announcements/put?id={id}&commonsId={commonsId}&startDate={start}&endDate={end}&announcementText={announcement}", id, commonsId, editedStart, editedEnd, editedAnnouncement).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
        verify(announcementRepository, atLeastOnce()).save(any(Announcement.class));
        String editedResponseString = editedResponse.getResponse().getContentAsString();
        String editedExpectedResponseString = mapper.writeValueAsString(editedAnnouncementObj);
        assertEquals(editedExpectedResponseString, editedResponseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCanEditAnnouncementWithoutStart() throws Exception {

        // arrange
        Long id = 0L;
        Long commonsId = 1L;
        Long userId = 1L;
        String announcement = "Hello world!";

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).announcementText(announcement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(put("/api/announcements/put?id={id}&commonsId={commonsId}&announcementText={announcement}", id, commonsId, announcement).with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
        verify(announcementRepository, atLeastOnce()).save(any(Announcement.class));
        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcementObj);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotEditAnnouncementIfNotInCommons() throws Exception {

        // arrange
        Long id = 0L;
        Long commonsId = 1L;
        Long userId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.empty());

        //act 
        MvcResult response = mockMvc.perform(put("/api/announcements/put?id={id}&commonsId={commonsId}&startDate={start}&announcementText={announcement}", id, commonsId, start, announcement).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, times(0)).findByAnnouncementId(id);
        verify(announcementRepository, times(0)).save(any(Announcement.class));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotEditAnnouncementThatDoesNotExist() throws Exception {

        // arrange
        Long id = 0L;
        Long commonsId = 1L;
        Long userId = 1L;
        String announcement = "Hello world!";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.empty());

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(put("/api/announcements/put?id={id}&commonsId={commonsId}&startDate={start}&announcementText={announcement}", id, commonsId, start, announcement).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, atLeastOnce()).findByAnnouncementId(id);
        verify(announcementRepository, times(0)).save(any(Announcement.class));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotEditAnnouncementToHaveEmptyStringAsAnnouncement() throws Exception {

        // arrange
        Long id = 0L;
        Long commonsId = 1L;
        Long userId = 1L;
        String announcement = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).announcementText(announcement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(put("/api/announcements/put?id={id}&commonsId={commonsId}&startDate={start}&announcementText={announcement}", id, commonsId, start, announcement).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, times(0)).findByAnnouncementId(id);
        verify(announcementRepository, times(0)).save(any(Announcement.class));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void userCannotEditAnnouncementToHaveEndBeforeStart() throws Exception {

        // arrange
        Long id = 0L;
        Long commonsId = 1L;
        Long userId = 1L;
        String announcement = "Announcement";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));
        Date start = sdf.parse("2024-03-03T17:39:43.000-08:00");
        Date end = sdf.parse("2022-03-03T17:39:43.000-08:00");

        Announcement announcementObj = Announcement.builder().id(id).commonsId(commonsId).startDate(start).endDate(end).announcementText(announcement).build();
        when(announcementRepository.findByAnnouncementId(id)).thenReturn(Optional.of(announcementObj));

        UserCommons userCommons = UserCommons.builder().build();
        when(userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)).thenReturn(Optional.of(userCommons));

        //act 
        MvcResult response = mockMvc.perform(put("/api/announcements/put?id={id}&commonsId={commonsId}&startDate={start}&endDate={end}&announcementText={announcement}", id, commonsId, start, end, announcement).with(csrf()))
            .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(announcementRepository, times(0)).findByAnnouncementId(id);
        verify(announcementRepository, times(0)).save(any(Announcement.class));
    }
}