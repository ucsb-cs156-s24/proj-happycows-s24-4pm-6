package edu.ucsb.cs156.happiercows;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import edu.ucsb.cs156.happiercows.services.wiremock.WiremockService;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;


public abstract class JobTestCase {

  @MockBean
  WiremockService mockWiremockService;

}
