package edu.ucsb.cs156.happiercows.services.wiremock;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.extension.responsetemplating.ResponseTemplateTransformer;
import com.github.tomakehurst.wiremock.junit.Stubbing;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.temporaryRedirect;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathMatching;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.options;

/**
 * This is a service for mocking authentication using wiremock
 * 
 * This class relies on property values. For hints on testing, see: <a href=
 * "https://www.baeldung.com/spring-boot-testing-configurationproperties">https://www.baeldung.com/spring-boot-testing-configurationproperties</a>
 * 
 */
@Slf4j
@Service("wiremockService")
@Profile("wiremock")
@ConfigurationProperties
public class WiremockServiceImpl extends WiremockService {

  WireMockServer wireMockServer;

  /**
   * This method returns the wiremockServer
   * 
   * @return the wiremockServer
   */
  public WireMockServer getWiremockServer() {
    return wireMockServer;
  }

  /**
   * This method sets up the necessary mocks for authentication
   * 
   * @param s in an instance of a WireMockServer or WireMockExtension
   */
  public static void setupOauthMocks(Stubbing s, boolean isAdmin) {

    s.stubFor(get(urlPathMatching("/oauth/authorize.*"))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-Type", "text/html")
            .withBodyFile("login.html")));

    s.stubFor(post(urlPathEqualTo("/login"))
        .willReturn(temporaryRedirect(
            "{{formData request.body 'form' urlDecode=true}}{{{form.redirectUri}}}?code={{{randomValue length=30 type='ALPHANUMERIC'}}}&state={{{form.state}}}")));

    s.stubFor(post(urlPathEqualTo("/oauth/token"))
        .willReturn(
            okJson(
                "{\"access_token\":\"{{randomValue length=20 type='ALPHANUMERIC'}}\",\"token_type\": \"Bearer\",\"expires_in\":\"3600\",\"scope\":\"https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid\"}")));

    if (isAdmin) {
      s.stubFor(get(urlPathMatching("/userinfo"))
          .willReturn(aResponse()
              .withStatus(200)
              .withHeader("Content-Type", "application/json")
              .withBody(
                  """
                      {
                        "sub": "107126842018026740288",
                        "name": "Admin GaucSho",
                        "given_name": "Admin",
                        "family_name": "Gaucho",
                        "picture": "https://lh3.googleusercontent.com/a/ACg8ocJpOe2SqIpirdIMx7KTj1W4OQ45t6FwpUo40K2V2JON=s96-c",
                        "email": "admingaucho@ucsb.edu",
                        "email_verified": true,
                        "locale": "en",
                        "hd": "ucsb.edu"
                      }
                      """)));
    } else {
      s.stubFor(get(urlPathMatching("/userinfo"))
          .willReturn(aResponse()
              .withStatus(200)
              .withHeader("Content-Type", "application/json")
              .withBody(
                  """
                      {
                        "sub": "107126842018026740288",
                        "name": "Chris Gaucho",
                        "given_name": "Chris",
                        "family_name": "Gaucho",
                        "picture": "https://lh3.googleusercontent.com/a/ACg8ocJpOe2SqIpirdIMx7KTj1W4OQ45t6FwpUo40K2V2JON=s96-c",
                        "email": "cgaucho@ucsb.edu",
                        "email_verified": true,
                        "locale": "en",
                        "hd": "ucsb.edu"
                      }
                      """)));
    }

  }

  /**
   * This method initializes the WireMockServer
   */
  public void init() {
    log.info("WiremockServiceImpl.init() called");

    WireMockServer wireMockServer = new WireMockServer(options()
        .port(8090) // No-args constructor will start on port
        .extensions(new ResponseTemplateTransformer(true)));

    setupOauthMocks(wireMockServer, true);

    wireMockServer.start();

    log.info("WiremockServiceImpl.init() completed");
  }
}