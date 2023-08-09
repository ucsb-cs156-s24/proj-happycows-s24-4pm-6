package edu.ucsb.cs156.happiercows.repositories.jobs;

import edu.ucsb.cs156.happiercows.entities.jobs.Job;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface JobsRepository extends CrudRepository<Job, Long> {
    public Page<Job> findAll(Pageable pageable);
}
