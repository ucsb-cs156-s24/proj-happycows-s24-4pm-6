package edu.ucsb.cs156.happiercows.controllers;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@Tag(name="User information (admin only)")
@RequestMapping("/api/admin/users")
@RestController
public class UsersController extends ApiController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ObjectMapper mapper;

    @Operation(summary = "Get a list of all users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<String> users()
            throws JsonProcessingException {
        Iterable<User> users = userRepository.findAll();
        String body = mapper.writeValueAsString(users);
        return ResponseEntity.ok().body(body);
    }

    @Operation(summary = "Suspend a user by id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/suspend")
    public Object suspendUser(@Parameter(name = "userid", description = "Long, user ID of user to suspend", example = "1", required = true) @RequestParam Long userid) {
        User user = userRepository.findById(userid)
                .orElseThrow(() -> new EntityNotFoundException(User.class, userid));

        user.setSuspended(true);
        userRepository.save(user);
        return genericMessage("User with id %s has been suspended".formatted(userid));
    }

    @Operation(summary = "Restore a user by id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/restore")
    public Object restoreUser(@Parameter(name = "userid", description = "Long, user ID of user to restore", example = "1", required = true) @RequestParam Long userid) {
        User user = userRepository.findById(userid)
                .orElseThrow(() -> new EntityNotFoundException(User.class, userid));

        user.setSuspended(false);
        userRepository.save(user);
        return genericMessage("User with id %s has been restored".formatted(userid));
    }
}