package edu.ucsb.cs156.happiercows.services.wiremock;


import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.tomakehurst.wiremock.WireMockServer;

/**
 * This is a dummy service for profiles besides wiremock where we do not want the mocked authentication,
 * but instead real oauth authentication
 */
@Slf4j
@Service("wiremockService")
@Profile("!wiremock")
@ConfigurationProperties
public class WiremockServiceDummy extends WiremockService {
  
    /**
     * Dummy call for getWiremockServer()
     * @return null
     */
    public WireMockServer getWiremockServer() {
      return null;
    }

    /**
     * Dummy call to init
     */
    public void init() {
      log.info("WiremockServiceDummy.init() called");
      log.info("WiremockServiceDummy.init() completed");
    }

}