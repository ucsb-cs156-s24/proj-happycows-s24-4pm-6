package edu.ucsb.cs156.happiercows.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.happiercows.entities.Announcement;

@Repository
public interface AnnouncementRepository extends CrudRepository<Announcement, Long> {
    
}