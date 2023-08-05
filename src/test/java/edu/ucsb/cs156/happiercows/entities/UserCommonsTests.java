package edu.ucsb.cs156.happiercows.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserCommonsTests {

    @Test
    void userCommons_serialized_to_json_includes_user_and_commons_id() {
        var objectMapper = new ObjectMapper();
        var userCommons = UserCommons.builder()
                .commons(Commons.builder().id(5).build())
                .user(User.builder().id(10).build())
                .cowHealth(50)
                .totalWealth(100)
                .build();

        // equivalent to serializing to json, then deserializing back to a map
        Map<String, Object> asMap = objectMapper.convertValue(userCommons, Map.class);

        assertEquals(5L, asMap.get("commonsId"));
        assertEquals(10L, asMap.get("userId"));
    }

    @Test
    void userCommons_setId() {
        // arrange
        var userCommons = UserCommons.builder()
                .commons(Commons.builder().id(5L).build())
                .user(User.builder().id(10L).build())
                .cowHealth(50)
                .totalWealth(100)
                .build();
        
        // act 

        var newUserCommonsKey = new UserCommonsKey(20L, 30L);
        userCommons.setId(newUserCommonsKey);
        
        // assert again
        assertEquals(newUserCommonsKey, userCommons.getId());

    }
}
