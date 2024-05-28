package edu.ucsb.cs156.happiercows.testconfig;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import edu.ucsb.cs156.happiercows.services.CurrentUserService;
import edu.ucsb.cs156.happiercows.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.happiercows.config.SecurityConfig;
import org.springframework.context.annotation.Import;

@TestConfiguration
@Import(SecurityConfig.class)
public class TestConfig {

    @Bean
    public CurrentUserService currentUserService() {
        return new MockCurrentUserServiceImpl();
    }

    @Bean
    public GrantedAuthoritiesService grantedAuthoritiesService() {
        return new GrantedAuthoritiesService();
    }
}
