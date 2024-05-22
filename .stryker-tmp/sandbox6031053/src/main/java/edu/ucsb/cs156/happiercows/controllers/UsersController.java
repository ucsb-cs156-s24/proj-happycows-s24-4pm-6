package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;


@Tag(name = "User information (admin only)")
@RequestMapping("/api/admin/users")
@RestController
public class UsersController extends ApiController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

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

    @Operation(summary = "Get a list of commons for a specific user")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{id}/commons")
    public ResponseEntity<List<Commons>> getUserCommons(@PathVariable long id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        List<Commons> commonsList = userCommonsRepository.findAllCommonsByUserId(id);
        return ResponseEntity.ok(commonsList);
    }

}