package edu.ucsb.cs156.happiercows.interceptors;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class RoleInterceptorTests {

    @MockBean
    UserRepository userRepository;

    @Autowired
    private RequestMappingHandlerMapping mapping;

    @BeforeEach
    public void mockLogin() {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("sub", "sub");
        attributes.put("name", "name");
        attributes.put("email", "testuser@example.com"); // this needs to match email below
        attributes.put("picture", "picture");
        attributes.put("given_name", "given_name");
        attributes.put("family_name", "family_name");
        attributes.put("email_verified", true);
        attributes.put("locale", "locale");
        attributes.put("hd", "hd");

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

        OAuth2User user = new DefaultOAuth2User(authorities, attributes, "name");
        Authentication authentication = new OAuth2AuthenticationToken(user, authorities, "client-id");

        SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    public void RoleInterceptorIsPresent() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/currentUser");
        HandlerExecutionChain chain = mapping.getHandler(request);

        assert chain != null;
        Optional<HandlerInterceptor> RoleInterceptor = chain.getInterceptorList()
            .stream()
            .filter(RoleInterceptor.class::isInstance)
            .findFirst();

        assertTrue(RoleInterceptor.isPresent());
    }

    @Test
    public void logsOutSuspendedUser() throws Exception {
        User suspendedUser = User.builder()
            .email("testuser@example.com")
            .suspended(true)
            .build();
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(suspendedUser));

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/currentUser");
        MockHttpServletResponse response = new MockHttpServletResponse();
        HandlerExecutionChain chain = mapping.getHandler(request);

        assert chain != null;
        Optional<HandlerInterceptor> RoleInterceptor = chain.getInterceptorList()
            .stream()
            .filter(RoleInterceptor.class::isInstance)
            .findFirst();

        assertTrue(RoleInterceptor.isPresent());

        boolean result = RoleInterceptor.get().preHandle(request, response, chain.getHandler());

        verify(userRepository, times(1)).findByEmail("testuser@example.com");
        assertFalse(result);
        assertTrue(response.getStatus() == HttpServletResponse.SC_FORBIDDEN);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    public void updatesAdminRoleWhenUserIsAdmin() throws Exception {
        User activeUser = User.builder()
            .email("testuser@example.com")
            .admin(true)
            .suspended(false)
            .build();
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(activeUser));

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/currentUser");
        MockHttpServletResponse response = new MockHttpServletResponse();
        HandlerExecutionChain chain = mapping.getHandler(request);

        assert chain != null;
        Optional<HandlerInterceptor> RoleInterceptor = chain.getInterceptorList()
            .stream()
            .filter(RoleInterceptor.class::isInstance)
            .findFirst();

        assertTrue(RoleInterceptor.isPresent());

        boolean result = RoleInterceptor.get().preHandle(request, response, chain.getHandler());

        verify(userRepository, times(1)).findByEmail("testuser@example.com");
        assertTrue(result);

        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        assertTrue(authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
    }

    @Test
    public void removesAdminRoleWhenUserIsNotAdmin() throws Exception {
        User activeUser = User.builder()
            .email("testuser@example.com")
            .admin(false)
            .suspended(false)
            .build();
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(activeUser));

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/currentUser");
        MockHttpServletResponse response = new MockHttpServletResponse();
        HandlerExecutionChain chain = mapping.getHandler(request);

        assert chain != null;
        Optional<HandlerInterceptor> RoleInterceptor = chain.getInterceptorList()
            .stream()
            .filter(RoleInterceptor.class::isInstance)
            .findFirst();

        assertTrue(RoleInterceptor.isPresent());

        boolean result = RoleInterceptor.get().preHandle(request, response, chain.getHandler());

        verify(userRepository, times(1)).findByEmail("testuser@example.com");
        assertTrue(result);

        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        assertFalse(authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
    }

    @Test
    public void noChangeWhenUserNotPresent() throws Exception {
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.empty());

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/currentUser");
        MockHttpServletResponse response = new MockHttpServletResponse();
        HandlerExecutionChain chain = mapping.getHandler(request);

        assert chain != null;
        Optional<HandlerInterceptor> RoleInterceptor = chain.getInterceptorList()
            .stream()
            .filter(RoleInterceptor.class::isInstance)
            .findFirst();

        assertTrue(RoleInterceptor.isPresent());

        boolean result = RoleInterceptor.get().preHandle(request, response, chain.getHandler());

        verify(userRepository, times(1)).findByEmail("testuser@example.com");
        assertTrue(result);

        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        assertTrue(authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
    }
}
