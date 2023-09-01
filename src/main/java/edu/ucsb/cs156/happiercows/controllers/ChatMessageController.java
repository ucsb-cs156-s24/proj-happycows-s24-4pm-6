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

import edu.ucsb.cs156.happiercows.entities.ChatMessage;
import edu.ucsb.cs156.happiercows.repositories.ChatMessageRepository;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

import org.springframework.security.core.Authentication;


import java.util.Optional;

@Tag(name = "Chat Message")
@RequestMapping("/api/chat")
@RestController
@Slf4j
public class ChatMessageController extends ApiController{

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    ObjectMapper mapper;

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

    

}
