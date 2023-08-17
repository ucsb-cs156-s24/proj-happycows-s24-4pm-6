package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import edu.ucsb.cs156.happiercows.entities.ChatMessage;
import edu.ucsb.cs156.happiercows.repositories.ChatMessageRepository;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

import java.util.Optional;

@Tag(name = "Chat Message")
@RequestMapping("/api/chat")
@RestController
public class ChatMessageController extends ApiController{

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    ObjectMapper mapper;

    @Operation(summary = "Get all chat messages", description = "Get all chat messages associated with a specific commons")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/get")
    public ResponseEntity<Object> getAllChatMessages(@Parameter(description = "The id of the common") @RequestParam Long commonsId,
                                            @Parameter(name="page") @RequestParam int page,
                                            @Parameter(name="size") @RequestParam int size) {
        
        // Make sure the user is part of the commons or is an admin
        User u = getCurrentUser().getUser();
        Long userId = u.getId();
        Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

        if (!userCommonsLookup.isPresent() && !u.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Return the list of non-hidden chat messages
        Page<ChatMessage> messages = chatMessageRepository.findByCommonsId(commonsId, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        return ResponseEntity.ok(messages);
    }

    @Operation(summary = "Get all chat messages", description = "Get all chat messages associated with a specific commons, even the hidden ones")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get/all")
    public ResponseEntity<Object> getAllChatMessages(@Parameter(description = "The id of the common") @RequestParam Long commonsId) {
        
        // Return the list of chat messages
        Iterable<ChatMessage> messages = chatMessageRepository.findAllByCommonsId(commonsId);
        return ResponseEntity.ok(messages);
    }

    @Operation(summary = "Create a chat message", description = "Create a chat message associated with a specific commons")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public ResponseEntity<Object> createChatMessage(@Parameter(description = "The id of the common") @RequestParam Long commonsId,
                                                    @Parameter(description = "The message to be sent") @RequestParam String content) {
        
        // Make sure the user is part of the commons
        User u = getCurrentUser().getUser();
        Long userId = u.getId();
        Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

        if (!userCommonsLookup.isPresent() && !u.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
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

        return ResponseEntity.ok(chatMessage);
    }

    @Operation(summary = "Delete a chat message", description = "Delete a chat message associated with a specific commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteChatMessage(@Parameter(description = "The id of the chat message") @RequestParam Long chatMessageId) {
        
        // Delete the chat message
        Optional<ChatMessage> chatMessageLookup = chatMessageRepository.findById(chatMessageId);
        if (!chatMessageLookup.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ChatMessage chatMessage = chatMessageLookup.get();
        chatMessage.setHidden(true);
        chatMessageRepository.save(chatMessage);

        return ResponseEntity.ok(chatMessage);
    }

    

}
