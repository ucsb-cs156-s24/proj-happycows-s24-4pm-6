package edu.ucsb.cs156.happiercows.interceptors;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class RoleInterceptorTests {

    private RoleInterceptor roleInterceptor;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Object handler;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        roleInterceptor = new RoleInterceptor();
        roleInterceptor.userRepository = userRepository;
    }

    @Test
    public void testPreHandle_withSuspendedUser_logsOutUser() throws Exception {
        User suspendedUser = User.builder().email("testuser@example.com").suspended(true).build();
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(suspendedUser));

        OAuth2User oAuth2User = new DefaultOAuth2User(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")), Collections.singletonMap("email", "testuser@example.com"), "email");
        OAuth2AuthenticationToken authenticationToken = new OAuth2AuthenticationToken(oAuth2User, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")), "client-id");

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        boolean result = roleInterceptor.preHandle(request, response, handler);

        verify(response).sendError(HttpServletResponse.SC_FORBIDDEN, "You have been suspended from using this site; please contact the site administrator for details.");
        assertFalse(result);
        assertTrue(SecurityContextHolder.getContext().getAuthentication() == null);
    }

    @Test
    public void testPreHandle_withActiveUser_updatesAuthorities() throws Exception {
        User activeUser = User.builder().email("testuser@example.com").admin(true).suspended(false).build();
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(activeUser));

        OAuth2User oAuth2User = new DefaultOAuth2User(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")), Collections.singletonMap("email", "testuser@example.com"), "email");
        OAuth2AuthenticationToken authenticationToken = new OAuth2AuthenticationToken(oAuth2User, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")), "client-id");

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        boolean result = roleInterceptor.preHandle(request, response, handler);

        assertTrue(result);
        assertTrue(SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    public void testPreHandle_withNonAdminUser_doesNotAddAdminRole() throws Exception {
        User nonAdminUser = User.builder().email("testuser@example.com").admin(false).suspended(false).build();
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(nonAdminUser));

        OAuth2User oAuth2User = new DefaultOAuth2User(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")), Collections.singletonMap("email", "testuser@example.com"), "email");
        OAuth2AuthenticationToken authenticationToken = new OAuth2AuthenticationToken(oAuth2User, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")), "client-id");

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        boolean result = roleInterceptor.preHandle(request, response, handler);

        assertTrue(result);
        assertFalse(SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
    }
}
