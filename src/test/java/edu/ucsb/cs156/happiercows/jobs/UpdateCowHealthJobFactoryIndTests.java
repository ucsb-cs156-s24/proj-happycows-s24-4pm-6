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

@RestClientTest(UpdateCowHealthJobFactoryInd.class)
@AutoConfigureDataJpa
public class UpdateCowHealthJobFactoryIndTests {

    @MockBean
    CommonsRepository commonsRepository;

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @MockBean
    UserRepository userRepository;

    @Autowired
    UpdateCowHealthJobFactoryInd updateCowHealthJobFactoryInd;

    @Test
    void test_create() throws Exception {

        // Act
        UpdateCowHealthJobInd updateCowHealthJobInd = (UpdateCowHealthJobInd) updateCowHealthJobFactoryInd.create(1L);

        // Assert
        assertEquals(commonsRepository,updateCowHealthJobInd.getCommonsRepository());
        assertEquals(userCommonsRepository,updateCowHealthJobInd.getUserCommonsRepository());
        assertEquals(userRepository,updateCowHealthJobInd.getUserRepository());

    }
}

