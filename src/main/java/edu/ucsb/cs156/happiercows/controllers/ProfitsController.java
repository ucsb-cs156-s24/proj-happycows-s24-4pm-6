package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.models.CurrentUser;
import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

import javax.validation.Valid;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(description = "Profits")
@RequestMapping("/api/profits")
@RestController
@Slf4j

public class ProfitsController extends ApiController {

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Autowired
    ProfitRepository profitRepository;

    @ApiOperation(value = "Get all profits belonging to a user commons as a user via CommonsID")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all/commonsid")
    public Iterable<Profit> allProfitsByCommonsId(
            @ApiParam("commonsId") @RequestParam Long commonsId) {
        Long userId = getCurrentUser().getUser().getId();

        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
            .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));

        if (userId != userCommons.getUserId())
            throw new EntityNotFoundException(UserCommons.class, userCommons.getId());

        Iterable<Profit> profits = profitRepository.findAllByUserCommonsId(userCommons.getId());

        return profits;
    }
}