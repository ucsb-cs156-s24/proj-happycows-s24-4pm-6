package edu.ucsb.cs156.happiercows;

import java.time.ZonedDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;

import edu.ucsb.cs156.happiercows.services.wiremock.WiremockService;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableJpaAuditing(dateTimeProviderRef = "utcDateTimeProvider")
@EnableAsync
@EnableScheduling
@Slf4j
public class HappierCowsApplication {

  @Autowired
  WiremockService wiremockService;

  /**
   * When using the wiremock profile, this method will call the code needed to set up the wiremock services
   */
  @Profile("wiremock")
  @Bean
  public ApplicationRunner wiremockApplicationRunner() {
    return arg -> {
      log.info("wiremock mode");
      wiremockService.init();
      log.info("wiremockApplicationRunner completed");
    };
  }

  /**
   * Hook that can be used to set up any services needed for development
   */
  @Profile("development")
  @Bean
  public ApplicationRunner developmentApplicationRunner() {
    return arg -> {
      log.info("development mode");
      log.info("developmentApplicationRunner completed");
    };
  }
  
  public static void main(String[] args) {
    SpringApplication.run(HappierCowsApplication.class, args);
  }
  @Bean
  public DateTimeProvider utcDateTimeProvider() {
      return () -> {
        ZonedDateTime now = ZonedDateTime.now();
        return Optional.of(now);
      };
  }

  // See: https://www.baeldung.com/spring-security-async-principal-propagation
  @Bean
  public DelegatingSecurityContextAsyncTaskExecutor taskExecutor(ThreadPoolTaskExecutor delegate) {
    return new DelegatingSecurityContextAsyncTaskExecutor(delegate);
  }

  // See: https://www.baeldung.com/spring-security-async-principal-propagation
  @Bean
  public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(2);
    executor.setQueueCapacity(500);
    executor.setThreadNamePrefix("HappierCows-");
    executor.initialize();
    return executor;
  }

}
