package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;

@RestClientTest(UpdateCowHealthJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCowHealthJobFactoryTests {

    @MockBean
    CommonsRepository commonsRepository;

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @MockBean
    UserRepository userRepository;

    @Autowired
    UpdateCowHealthJobFactory updateCowHealthJobFactory;

    @Test
    void test_create() throws Exception {

        // Act
        UpdateCowHealthJob updateCowHealthJob = updateCowHealthJobFactory.create();

        // Assert
        assertEquals(commonsRepository,updateCowHealthJob.getCommonsRepository());
        assertEquals(userCommonsRepository,updateCowHealthJob.getUserCommonsRepository());
        assertEquals(userRepository,updateCowHealthJob.getUserRepository());

    }
}

