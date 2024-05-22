package edu.ucsb.cs156.happiercows.services;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.models.SystemInfo;

// The unit under test relies on property values
// For hints on testing, see: https://www.baeldung.com/spring-boot-testing-configurationproperties


@ExtendWith(SpringExtension.class)
@EnableConfigurationProperties(value = SystemInfoServiceImpl.class)
@TestPropertySource("classpath:application-development.properties")
class SystemInfoServiceImplTests  {
  
  @Autowired
  private SystemInfoService systemInfoService;

  @Test
  void test_getSystemInfo() {
    SystemInfo si = systemInfoService.getSystemInfo();
    assertTrue(si.getSpringH2ConsoleEnabled());
    assertTrue(si.getShowSwaggerUILink());
    assertEquals("https://github.com/ucsb-cs156/proj-happycows", si.getSourceRepo());
  }

}
