package edu.ucsb.cs156.happiercows;

import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.options;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.extension.responsetemplating.ResponseTemplateTransformer;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

import edu.ucsb.cs156.happiercows.services.wiremock.WiremockServiceImpl;

@ActiveProfiles("integration")
public abstract class WebTestCase {
    @LocalServerPort
    private int port;

    @Value("${app.playwright.headless:true}")
    private boolean runHeadless;

    private static WireMockServer wireMockServer;

    protected Browser browser;
    protected Page page;

    @BeforeAll
    public static void setupWireMock() {
        wireMockServer = new WireMockServer(options()
                .port(8090)
                .extensions(new ResponseTemplateTransformer(true)));

        WiremockServiceImpl.setupOauthMocks(wireMockServer, false);

        wireMockServer.start();
    }

    @AfterAll
    public static void teardownWiremock() {
        wireMockServer.stop();
    }

    @AfterEach
    public void teardown() {
        browser.close();
    }

    public void setupUser(boolean isAdmin) {
        WiremockServiceImpl.setupOauthMocks(wireMockServer, isAdmin);

        browser = Playwright.create().chromium().launch(new BrowserType.LaunchOptions().setHeadless(runHeadless));

        BrowserContext context = browser.newContext();
        page = context.newPage();

        String url = String.format("http://localhost:%d/oauth2/authorization/my-oauth-provider", port);
        page.navigate(url);

        if (isAdmin) {
            page.locator("#username").fill("admingaucho@ucsb.edu");
        } else {
            page.locator("#username").fill("cgaucho@ucsb.edu");
        }

        page.locator("#password").fill("password");
        page.locator("#submit").click();
    }
}