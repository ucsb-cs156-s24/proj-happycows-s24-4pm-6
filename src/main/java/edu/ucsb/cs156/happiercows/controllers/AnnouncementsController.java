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
        @Parameter(description = "The datetime at which the announcement will be shown (defaults to current time)") @RequestParam(required = false) Date start,
        @Parameter(description = "The datetime at which the announcement will stop being shown (optional)") @RequestParam(required = false) Date end,
        @Parameter(description = "The announcement to be sent out") @RequestParam String announcement) {
        
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

        if (start == null) { 
            log.info("Start date not specified. Defaulting to current date.");
            start = new Date(); 
        }

        if (announcement == "") {
            return ResponseEntity.badRequest().body("Announcement cannot be empty.");
        }
        if (end != null && start.after(end)) {
            return ResponseEntity.badRequest().body("Start date must be before end date.");
        }

        // Create the announcement
        Announcement announcementObj = Announcement.builder()
        .commonsId(commonsId)
        .start(start)
        .end(end)
        .announcement(announcement)
        .build();

        // Save the announcement
        announcementRepository.save(announcementObj);

        return ResponseEntity.ok(announcementObj);
    }

    @Operation(summary = "Get all announcements", description = "Get all announcements associated with a specific commons.")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/getbycommonsid")
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
        Page<Announcement> announcements = announcementRepository.findByCommonsId(commonsId, PageRequest.of(0, MAX_ANNOUNCEMENTS, Sort.by("start").descending()));
        return ResponseEntity.ok(announcements);
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
        @Parameter(description = "The datetime at which the announcement will be shown (defaults to current time)") @RequestParam(required = false) Date start,
        @Parameter(description = "The datetime at which the announcement will stop being shown (optional)") @RequestParam(required = false) Date end,
        @Parameter(description = "The announcement to be sent out") @RequestParam String announcement) {
        
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

        if (announcement == "") {
            return ResponseEntity.badRequest().body("Announcement cannot be empty.");
        }

        if (start == null) {
            log.info("Start date not specified. Defaulting to current date.");
            start = new Date();
        }
        
        Optional<Announcement> announcementLookup = announcementRepository.findByAnnouncementId(id);
        
        if (!announcementLookup.isPresent()) {
            return ResponseEntity.badRequest().body("Announcement could not be found. Invalid id.");
        }

        // Create the announcement
        Announcement announcementObj = announcementLookup.get();
        announcementObj.setCommonsId(commonsId);
        announcementObj.setStart(start);
        announcementObj.setEnd(end);
        announcementObj.setAnnouncement(announcement);

        // Save the announcement
        announcementRepository.save(announcementObj);
        return ResponseEntity.ok(announcementObj);
    }


    @Operation(summary = "Delete an announcdement", description = "Delete an announcement associated with an id")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<Object> hideChatMessage(@Parameter(description = "The id of the chat message") @RequestParam Long id) {

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


    /*

    @Operation(summary = "Get all chat messages", description = "Get all chat messages associated with a specific commons.")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/get")
    public ResponseEntity<Object> getChatMessages(@Parameter(description = "The id of the common") @RequestParam Long commonsId,
                                            @Parameter(name="page") @RequestParam int page,
                                            @Parameter(name="size") @RequestParam int size) {
        
        // Make sure the user is part of the commons or is an admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
            log.info("User is not an admin");
            User user = getCurrentUser().getUser();
            Long userId = user.getId();
            Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

            if (!userCommonsLookup.isPresent()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        // Return the list of non-hidden chat messages
        Page<ChatMessage> messages = chatMessageRepository.findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        return ResponseEntity.ok(messages);
    }

    @Operation(summary = "Get all chat messages (Admins)", description = "Get all chat messages associated with a specific commons, even the hidden ones. Used only by admins")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/get")
    public ResponseEntity<Object> getAllChatMessages(@Parameter(description = "The id of the common") @RequestParam Long commonsId,
                                                    @Parameter(name="page") @RequestParam int page,
                                                    @Parameter(name="size") @RequestParam int size) {
        
        // Return the list of chat messages
        Page<ChatMessage> messages = chatMessageRepository.findAllByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        return ResponseEntity.ok(messages);
    }

    
    @Operation(summary = "Get hidden chat messages", description = "Get all hidden chat messages associated with a specific commons. Used only by admins")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/hidden")
    public ResponseEntity<Object> getHiddenChatMessages(@Parameter(description = "The id of the common") @RequestParam Long commonsId,
                                                    @Parameter(name="page") @RequestParam int page,
                                                    @Parameter(name="size") @RequestParam int size) {
        
        // Return the list of hidden chat messages
        Page<ChatMessage> messages = chatMessageRepository.findByCommonsIdAndHidden(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        return ResponseEntity.ok(messages);
    }
    
    
    @Operation(summary = "Create a chat message", description = "Create a chat message associated with a specific commons")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @PostMapping("/post")
    public ResponseEntity<Object> createChatMessage(@Parameter(description = "The id of the common") @RequestParam Long commonsId,
                                                    @Parameter(description = "The message to be sent") @RequestParam String content) {
        
        User user = getCurrentUser().getUser();
        Long userId = user.getId();

        // Make sure the user is part of the commons or is an admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
            log.info("User is not an admin");
            Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

            if (!userCommonsLookup.isPresent()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        // Create the chat message
        ChatMessage chatMessage = ChatMessage.builder()
        .commonsId(commonsId)
        .userId(userId)
        .message(content)
        .hidden(false)
        .dm(false)
        .toUserId(0)
        .build();

        // Save the message
        chatMessageRepository.save(chatMessage);

        return ResponseEntity.ok(chatMessage);
    }

    @Operation(summary = "Delete a chat message", description = "Delete a chat message associated with a specific commons")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @PutMapping("/hide")
    public ResponseEntity<Object> hideChatMessage(@Parameter(description = "The id of the chat message") @RequestParam Long chatMessageId) {

        // Try to get the chat message
        Optional<ChatMessage> chatMessageLookup = chatMessageRepository.findById(chatMessageId);
        if (!chatMessageLookup.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        ChatMessage chatMessage = chatMessageLookup.get();

        User user = getCurrentUser().getUser();
        Long userId = user.getId();

        // Check if the user is the author of the message
        if (chatMessage.getUserId() != userId) {
            // Check if the user is an admin
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        // Hide the message
        chatMessage.setHidden(true);
        chatMessageRepository.save(chatMessage);

        return ResponseEntity.ok(chatMessage);
    }

    
    */
}
