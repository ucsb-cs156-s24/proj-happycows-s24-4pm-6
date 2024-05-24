package edu.ucsb.cs156.happiercows.interceptors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RoleInterceptor implements HandlerInterceptor {

    @Autowired
    UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User principal = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            String email = principal.getAttribute("email");
            Optional<User> optionalUser = userRepository.findByEmail(email);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (Boolean.TRUE.equals(user.getSuspended())) {
                    // Log out suspended user
                    SecurityContextHolder.clearContext();
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "You have been suspended from using this site; please contact the site administrator for details.");
                    return false;
                }

                Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
                Set<GrantedAuthority> revisedAuthorities = authorities.stream()
                    .filter(grantedAuth -> !grantedAuth.getAuthority().equals("ROLE_ADMIN"))
                    .collect(Collectors.toSet());

                if (user.isAdmin()) {
                    revisedAuthorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                }

                Authentication newAuth = new OAuth2AuthenticationToken(principal, revisedAuthorities, ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId());
                SecurityContextHolder.getContext().setAuthentication(newAuth);
            }
        }
        return true;
    }
}
