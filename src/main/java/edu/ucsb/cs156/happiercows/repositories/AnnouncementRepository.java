package edu.ucsb.cs156.happiercows.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import edu.ucsb.cs156.happiercows.entities.Announcement;

import java.util.Optional;
import java.util.Date;

@Repository
public interface AnnouncementRepository extends CrudRepository<Announcement, Long> {
    @Query(value = "SELECT ann FROM announcement ann WHERE ann.commonsId = :commonsId AND (ann.end IS NULL OR ann.end > CURRENT_TIMESTAMP)")
    Page<Announcement> findByCommonsId(Long commonsId, Pageable pageable);

    @Query(value = "SELECT ann FROM announcement ann WHERE ann.id = :id")
    Optional<Announcement> findByAnnouncementId(Long id);
}