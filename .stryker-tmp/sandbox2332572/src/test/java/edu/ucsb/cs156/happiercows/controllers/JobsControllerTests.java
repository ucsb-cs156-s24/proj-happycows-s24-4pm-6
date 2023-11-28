package edu.ucsb.cs156.happiercows.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.awaitility.Awaitility.await;

import static java.util.concurrent.TimeUnit.SECONDS;

import java.util.ArrayList;
import java.util.Arrays;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobService;
import edu.ucsb.cs156.happiercows.services.CommonsPlusBuilderService;
import edu.ucsb.cs156.happiercows.jobs.InstructorReportJobFactory;
import edu.ucsb.cs156.happiercows.jobs.InstructorReportJobSingleCommonsFactory;
import edu.ucsb.cs156.happiercows.jobs.MilkTheCowsJobFactory;
import edu.ucsb.cs156.happiercows.jobs.MilkTheCowsJobFactoryInd;
import edu.ucsb.cs156.happiercows.jobs.SetCowHealthJobFactory;
import edu.ucsb.cs156.happiercows.jobs.UpdateCowHealthJobFactory;
import edu.ucsb.cs156.happiercows.jobs.UpdateCowHealthJobFactoryInd;
import edu.ucsb.cs156.happiercows.jobs.RecordCommonStatsJob;
import edu.ucsb.cs156.happiercows.jobs.RecordCommonStatsJobFactory;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@WebMvcTest(controllers = JobsController.class)
@Import(JobService.class)
@AutoConfigureDataJpa
public class JobsControllerTests extends ControllerTestCase {

        @MockBean
        JobsRepository jobsRepository;

        @MockBean
        UserRepository userRepository;

        @Autowired
        JobService jobService;

        @Autowired
        ObjectMapper objectMapper;

        @MockBean
        CommonsRepository commonsRepository;

        @MockBean
        UserCommonsRepository userCommonsRepository;

        @MockBean
        UpdateCowHealthJobFactory updateCowHealthJobFactory;

        @MockBean
        MilkTheCowsJobFactory milkTheCowsJobFactory;

        @MockBean
        SetCowHealthJobFactory setCowHealthJobFactory;

        @MockBean
        InstructorReportJobFactory instructorReportJobFactory;

        @MockBean
        InstructorReportJobSingleCommonsFactory instructorReportJobSingleCommonsFactory;

        @MockBean
        MilkTheCowsJobFactoryInd milkTheCowsJobFactoryInd;

        @MockBean
        UpdateCowHealthJobFactoryInd updateCowHealthJobFactoryInd;

        @MockBean
        RecordCommonStatsJobFactory recordCommonStatsJobFactory;

        @MockBean
        CommonsPlusBuilderService commonsPlusBuilderService;

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_get_all_jobs() throws Exception {

                // arrange

                Job job1 = Job.builder().log("this is job 1").build();
                Job job2 = Job.builder().log("this is job 2").build();

                ArrayList<Job> expectedJobs = new ArrayList<>();
                expectedJobs.addAll(Arrays.asList(job1, job2));

                when(jobsRepository.findAll()).thenReturn(expectedJobs);

                // act
                MvcResult response = mockMvc.perform(get("/api/jobs/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(jobsRepository, atLeastOnce()).findAll();
                String expectedJson = mapper.writeValueAsString(expectedJobs);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_get_all_jobs_paged() throws Exception {

                // arrange

                PageRequest pageRequest = PageRequest.of(0, 5);

                Job job1 = Job.builder().log("this is job 1").build();
                Job job2 = Job.builder().log("this is job 2").build();

                ArrayList<Job> expectedJobs = new ArrayList<>();
                expectedJobs.addAll(Arrays.asList(job1, job2));

                Page<Job> expectedJobPage = new PageImpl<>(expectedJobs, pageRequest, expectedJobs.size());

                when(jobsRepository.findAll(any())).thenReturn(expectedJobPage);

                // act
                MvcResult response = mockMvc.perform(get("/api/jobs/all/pageable?page=0&size=10"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(jobsRepository, atLeastOnce()).findAll(any());

                String expectedJson = mapper.writeValueAsString(expectedJobPage);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_test_job() throws Exception {

                // arrange

                User user = currentUserService.getUser();

                Job jobStarted = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("running")
                                .log("Hello World! from test job!\nauthentication is not null")
                                .build();

                Job jobCompleted = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("complete")
                                .log("Hello World! from test job!\nauthentication is not null\nGoodbye from test job!")
                                .build();

                when(jobsRepository.save(any(Job.class))).thenReturn(jobStarted).thenReturn(jobCompleted);

                // act
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=2000").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertEquals("running", jobReturned.getStatus());

                await().atMost(1, SECONDS)
                                .untilAsserted(() -> verify(jobsRepository, times(3)).save(eq(jobStarted)));
                await().atMost(10, SECONDS)
                                .untilAsserted(() -> verify(jobsRepository, times(5)).save(eq(jobCompleted)));
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_test_job_that_fails() throws Exception {

                // arrange

                User user = currentUserService.getUser();

                Job jobStarted = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("running")
                                .log("Hello World! from test job!\nauthentication is not null")
                                .build();

                Job jobFailed = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("error")
                                .log("Hello World! from test job!\nauthentication is not null\nFail!")
                                .build();

                when(jobsRepository.save(any(Job.class))).thenReturn(jobStarted).thenReturn(jobFailed);

                // act
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=true&sleepMs=4000").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                String responseString = response.getResponse().getContentAsString();
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertEquals("running", jobReturned.getStatus());

                await().atMost(1, SECONDS)
                                .untilAsserted(() -> verify(jobsRepository, times(3)).save(eq(jobStarted)));

                await().atMost(10, SECONDS)
                                .untilAsserted(() -> verify(jobsRepository, times(4)).save(eq(jobFailed)));
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_milk_the_cows_job() throws Exception {

                // act
                MvcResult response = mockMvc.perform(post("/api/jobs/launch/milkthecowjob").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_milk_the_cows_individual_job() throws Exception {

                // act
                MvcResult response = mockMvc.perform(post("/api/jobs/launch/milkthecowjobsinglecommons?commonsId=1").with(csrf())).andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_instructor_report_job() throws Exception {
                // act
                MvcResult response = mockMvc.perform(post("/api/jobs/launch/instructorreport").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_update_cow_health_job() throws Exception {
                // act
                MvcResult response = mockMvc.perform(post("/api/jobs/launch/updatecowhealth").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_update_cow_health_job_individual() throws Exception {
                // act
                MvcResult response = mockMvc.perform(post("/api/jobs/launch/updatecowhealthsinglecommons?commonsId=1").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_set_cow_health_job() throws Exception {
                // act
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/setcowhealth?commonsID=1&health=20").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_instructor_report_single_commons_job() throws Exception {
                // act
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/instructorreportsinglecommons?commonsId=1")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_set_cow_health_job_with_invalid_parameter() throws Exception {
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/setcowhealth?commonsID=1&health=-1").with(csrf()))
                                .andExpect(status().isBadRequest()).andReturn();
                assertInstanceOf(IllegalArgumentException.class, response.getResolvedException());

                response = mockMvc
                                .perform(post("/api/jobs/launch/setcowhealth?commonsID=1&health=101").with(csrf()))
                                .andExpect(status().isBadRequest()).andReturn();
                assertInstanceOf(IllegalArgumentException.class, response.getResolvedException());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_test_job_with_invalid_parameter() throws Exception {
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=-1").with(csrf()))
                                .andExpect(status().isBadRequest()).andReturn();
                assertInstanceOf(IllegalArgumentException.class, response.getResolvedException());

                response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=60001").with(csrf()))
                                .andExpect(status().isBadRequest()).andReturn();
                assertInstanceOf(IllegalArgumentException.class, response.getResolvedException());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_set_cow_health_job_with_boundary_parameter() throws Exception {
                // boundary are 0 and 100
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/setcowhealth?commonsID=1&health=0").with(csrf()))
                                .andExpect(status().isOk()).andReturn();
                
                response = mockMvc
                                .perform(post("/api/jobs/launch/setcowhealth?commonsID=1&health=100").with(csrf()))
                                .andExpect(status().isOk()).andReturn();        
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_test_job_with_boundary_parameter() throws Exception {
                // boundary are 0 and 60000
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=0").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=60000").with(csrf()))
                                .andExpect(status().isOk()).andReturn();        
        }
        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_record_common_stats_job() throws Exception {
                // act
                MvcResult response = mockMvc.perform(post("/api/jobs/launch/recordcommonstats").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                log.info("responseString={}", responseString);
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertNotNull(jobReturned.getStatus());
        }

}