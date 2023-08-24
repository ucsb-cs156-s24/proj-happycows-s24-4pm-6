package edu.ucsb.cs156.happiercows.repositories;

import edu.ucsb.cs156.happiercows.entities.CommonStats;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Sort;

@Repository
public interface CommonStatsRepository extends CrudRepository<CommonStats, Long> {
    Iterable<CommonStats> findAllByCommonsId(Long commonsId);
    Iterable<CommonStats> findAll(Sort sort);
}
