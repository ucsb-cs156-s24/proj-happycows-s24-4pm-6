package edu.ucsb.cs156.happiercows.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.happiercows.entities.ChatMessage;

@Repository
public interface ChatMessageRepository extends CrudRepository<ChatMessage, Long>{
    
}
