package edu.ucsb.cs156.happiercows.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "chat_message")
public class ChatMessage {
    
    // Unique Message Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // The user that created this message and the commons that it belongs in
    private long userId;
    private long commonsId;

    // Message timestamp and payload
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;
    private String message;

    // For future use in DMs
    private boolean dm;
    private long toUserId;

    // We do not delete messages in the backend, we just hide them
    @Builder.Default
    private boolean hidden = false;
}
