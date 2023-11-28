package edu.ucsb.cs156.happiercows.repositories;

import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.UserCommonsKey;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCommonsRepository extends CrudRepository<UserCommons, UserCommonsKey> {
    @Query("SELECT uc FROM user_commons uc WHERE uc.commons.id = :commonsId AND uc.user.id = :userId")
    Optional<UserCommons> findByCommonsIdAndUserId(Long commonsId, Long userId);
    @Query("SELECT uc FROM user_commons uc WHERE uc.commons.id = :commonsId")
    Iterable<UserCommons> findByCommonsId(Long commonsId);
}
