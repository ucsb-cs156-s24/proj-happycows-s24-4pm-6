package edu.ucsb.cs156.happiercows.testconfig;

import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.services.CurrentUserServiceImpl;

@Slf4j
@Service("testingUser")
public class MockCurrentUserServiceImpl extends CurrentUserServiceImpl {

  public User getMockUser(SecurityContext securityContext, Authentication authentication) {
    Object principal = authentication.getPrincipal();

    String googleSub = "fakeUser";
    String email = "user@example.org";
    String pictureUrl = "https://example.org/fake.jpg";
    String fullName = "Fake User";
    String givenName = "Fake";
    String familyName = "User";
    boolean emailVerified = true;
    String locale="";
    String hostedDomain="example.org";
    boolean admin=false;
    Instant lastOnline = Instant.ofEpochSecond(100);

    org.springframework.security.core.userdetails.User user = null;


    if (principal instanceof org.springframework.security.core.userdetails.User) {
      log.info("principal instance of org.springframework.security.core.userdetails.User");
      user = (org.springframework.security.core.userdetails.User) principal;
      googleSub = "fake_" + user.getUsername();
      email = user.getUsername() + "@example.org";
      pictureUrl = "https://example.org/" +  user.getUsername() + ".jpg";
      fullName = "Fake " + user.getUsername();
      givenName = "Fake";
      familyName = user.getUsername();
      emailVerified = true;
      locale="";
      hostedDomain="example.org";
      admin= (user.getUsername().equals("admin"));
    }

    User u = User.builder()
    .googleSub(googleSub)
    .email(email)
    .pictureUrl(pictureUrl)
    .fullName(fullName)
    .givenName(givenName)
    .familyName(familyName)
    .emailVerified(emailVerified)
    .locale(locale)
    .hostedDomain(hostedDomain)
    .admin(admin)
    .id(1L)
    .lastOnline(lastOnline)
    .build();
    
    log.info("************** ALERT **********************");
    log.info("************* MOCK USER********************");
    log.info("authentication={}",authentication);
    log.info("securityContext={}",securityContext);
    log.info("principal={}",principal);
    log.info("user (spring security) ={}",user);
    log.info("u (our custom user entity)={}",u);
    log.info("************** END ALERT ******************");

    return u;
  }

  public User getUser() {
    SecurityContext securityContext = SecurityContextHolder.getContext();
    Authentication authentication = securityContext.getAuthentication();

    if (!(authentication instanceof OAuth2AuthenticationToken)) {
      return getMockUser(securityContext, authentication);
    }

    return null;
  }

}
