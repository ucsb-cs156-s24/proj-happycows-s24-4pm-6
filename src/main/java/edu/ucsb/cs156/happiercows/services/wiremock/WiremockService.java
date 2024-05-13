package edu.ucsb.cs156.happiercows.services.wiremock;

import com.github.tomakehurst.wiremock.WireMockServer;

/**
 * This is a service for mocking authentication using wiremock
 * 
 * This class relies on property values. For hints on testing, see: <a href="https://www.baeldung.com/spring-boot-testing-configurationproperties">https://www.baeldung.com/spring-boot-testing-configurationproperties</a>
 * 
 * There are two imlementations of the class, depending on the profile in use
 */
public abstract class WiremockService {
  /**
   * This method returns the wiremockServer
   * @return the wiremockServer
   */
  public abstract WireMockServer getWiremockServer();
  /**
   * This method initializes the WireMockServer 
   */
  public abstract void init();
}