package edu.ucsb.cs156.happiercows.repositories;

import edu.ucsb.cs156.happiercows.entities.Report;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Sort;

@Repository
public interface ReportRepository extends CrudRepository<Report, Long> {
    Iterable<Report> findAllByCommonsId(Long commonsId);
    Iterable<Report> findAll(Sort sort);
}
