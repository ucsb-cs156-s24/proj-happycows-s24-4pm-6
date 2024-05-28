package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import edu.ucsb.cs156.happiercows.entities.Announcement;
import edu.ucsb.cs156.happiercows.repositories.AnnouncementRepository;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

import org.springframework.security.core.Authentication;
import java.util.Date;


import java.util.Optional;

@Tag(name = "Announcements")
@RequestMapping("/api/announcements")
@RestController
@Slf4j
public class AnnouncementsController extends ApiController{

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    ObjectMapper mapper;


    @Operation(summary = "Create an announcement", description = "Create an announcement associated with a specific commons")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @PostMapping("/post")
    public ResponseEntity<Object> createAnnouncement(
        @Parameter(description = "The id of the common") @RequestParam Long commonsId,
        @Parameter(description = "The datetime at which the announcement will be shown (defaults to current time)") @RequestParam(required = false) Date startDate,
        @Parameter(description = "The datetime at which the announcement will stop being shown (optional)") @RequestParam(required = false) Date endDate,
        @Parameter(description = "The announcement to be sent out") @RequestParam String announcementText) {

        User user = getCurrentUser().getUser();
        Long userId = user.getId();

        // Make sure the user is part of the commons or is an admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
            log.info("User is not an admin");
            Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

            if (!userCommonsLookup.isPresent()) {
                return ResponseEntity.badRequest().body("Commons_id must exist.");
            }
        }

        if (startDate == null) { 
            log.info("Start date not specified. Defaulting to current date.");
            startDate = new Date(); 
        }

        if (announcementText == "") {
            return ResponseEntity.badRequest().body("Announcement cannot be empty.");
        }
        if (endDate != null && startDate.after(endDate)) {
            return ResponseEntity.badRequest().body("Start date must be before end date.");
        }

        // Create the announcement
        Announcement announcementObj = Announcement.builder()
        .commonsId(commonsId)
        .startDate(startDate)
        .endDate(endDate)
        .announcementText(announcementText)
        .build();

        // Save the announcement
        announcementRepository.save(announcementObj);

        return ResponseEntity.ok(announcementObj);
    }

    @Operation(summary = "Get all announcements", description = "Get all announcements associated with a specific commons.")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Object> getAnnouncements(@Parameter(description = "The id of the common") @RequestParam Long commonsId) {

        // Make sure the user is part of the commons or is an admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
            log.info("User is not an admin");
            User user = getCurrentUser().getUser();
            Long userId = user.getId();
            Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

            if (!userCommonsLookup.isPresent()) {
                return ResponseEntity.badRequest().body("Commons_id must exist.");
            }
        }

        int MAX_ANNOUNCEMENTS = 1000;
        Page<Announcement> announcements = announcementRepository.findByCommonsId(commonsId, PageRequest.of(0, MAX_ANNOUNCEMENTS, Sort.by("startDate").descending()));
        return ResponseEntity.ok(announcements.getContent());
    }

    @Operation(summary = "Get announcements by id", description = "Get announcement by its id.")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/getbyid")
    public ResponseEntity<Object> getAnnouncementById(@Parameter(description = "The id of the announcement") @RequestParam Long id) {

        Optional<Announcement> announcementLookup = announcementRepository.findByAnnouncementId(id);
        if (!announcementLookup.isPresent()) {
            return ResponseEntity.badRequest().body("Cannot find announcement. id is invalid.");

        }
        return ResponseEntity.ok(announcementLookup.get());
    }

    @Operation(summary = "Edit an announcement", description = "Edit an announcement by its id.")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @PutMapping("/put")
    public ResponseEntity<Object> editAnnouncement(
        @Parameter(description = "The id of the announcement") @RequestParam Long id,
        @Parameter(description = "The id of the common") @RequestParam Long commonsId,
        @Parameter(description = "The datetime at which the announcement will be shown (defaults to current time)") @RequestParam(required = false) Date startDate,
        @Parameter(description = "The datetime at which the announcement will stop being shown (optional)") @RequestParam(required = false) Date endDate,
        @Parameter(description = "The announcement to be sent out") @RequestParam String announcementText) {

        User user = getCurrentUser().getUser();
        Long userId = user.getId();

        // Make sure the user is part of the commons or is an admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
            log.info("User is not an admin");
            Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

            if (!userCommonsLookup.isPresent()) {
                return ResponseEntity.badRequest().body("Commons_id must exist.");
            }
        }

        if (announcementText == "") {
            return ResponseEntity.badRequest().body("Announcement cannot be empty.");
        }

        if (startDate == null) {
            log.info("Start date not specified. Defaulting to current date.");
            startDate = new Date();
        }

        if (endDate != null && startDate.after(endDate)) {
            return ResponseEntity.badRequest().body("Start date must be before end date.");
        }

        Optional<Announcement> announcementLookup = announcementRepository.findByAnnouncementId(id);

        if (!announcementLookup.isPresent()) {
            return ResponseEntity.badRequest().body("Announcement could not be found. Invalid id.");
        }

        // Create the announcement
        Announcement announcementObj = announcementLookup.get();
        announcementObj.setStartDate(startDate);
        announcementObj.setEndDate(endDate);
        announcementObj.setAnnouncementText(announcementText);

        // Save the announcement
        announcementRepository.save(announcementObj);
        return ResponseEntity.ok(announcementObj);
    }


    @Operation(summary = "Delete an announcement", description = "Delete an announcement associated with an id")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteAnnouncement(@Parameter(description = "The id of the chat message") @RequestParam Long id) {

        // Try to get the chat message
        Optional<Announcement> announcementLookup = announcementRepository.findByAnnouncementId(id);
        if (!announcementLookup.isPresent()) {
            return ResponseEntity.badRequest().body("Cannot find announcement. id is invalid.");
        }
        Announcement announcementObj = announcementLookup.get();

        User user = getCurrentUser().getUser();
        Long userId = user.getId();

        // Hide the message
        announcementRepository.delete(announcementObj);
        return ResponseEntity.ok(announcementObj);
    }


}