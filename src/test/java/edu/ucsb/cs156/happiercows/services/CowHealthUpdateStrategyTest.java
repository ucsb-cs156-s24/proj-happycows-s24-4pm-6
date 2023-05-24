package edu.ucsb.cs156.happiercows.services;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CowHealthUpdateStrategyTest {

    @Test
    void getByName_can_get_strategy_by_name() {
        assertEquals(Optional.of(CowHealthUpdateStrategy.Linear), CowHealthUpdateStrategy.getByName("Linear"));
    }

    @Test
    void getByName_returns_empty_optional_if_name_is_invalid() {
        assertEquals(Optional.empty(), CowHealthUpdateStrategy.getByName("invalid"));
    }

    @Test
    void can_get_all_strategies() {
        var values = CowHealthUpdateStrategy.values();
        assertTrue(values.length > 0);
    }

    @Test
    void get_name_and_description() {
        assertEquals("Linear", CowHealthUpdateStrategy.Linear.name());
        assertEquals("Linear", CowHealthUpdateStrategy.Linear.getDisplayName());
        assertEquals("Cow health increases/decreases proportionally to the number of cows over/under the carrying capacity.", CowHealthUpdateStrategy.Linear.getDescription());
    }


    Commons commons = Commons.builder()
            .degradationRate(0.01)
            .carryingCapacity(100)
            .build();
    UserCommons user = UserCommons.builder().cowHealth(50).build();

    @Test
    void linear_updates_health_proportional_to_num_cows_over_capacity() {
        var formula = CowHealthUpdateStrategy.Linear;

        assertEquals(49.9, formula.calculateNewCowHealth(commons, user, 110));
        assertEquals(50.0, formula.calculateNewCowHealth(commons, user, 100));
        assertEquals(50.1, formula.calculateNewCowHealth(commons, user, 90));
    }

    @Test
    void constant_changes_by_constant_amount() {
        var formula = CowHealthUpdateStrategy.Constant;

        assertEquals(49.99, formula.calculateNewCowHealth(commons, user, 120));
        assertEquals(49.99, formula.calculateNewCowHealth(commons, user, 110));
        assertEquals(50.01, formula.calculateNewCowHealth(commons, user, 100));
        assertEquals(50.01, formula.calculateNewCowHealth(commons, user, 90));
    }

    @Test
    void noop_does_nothing() {
        var formula = CowHealthUpdateStrategy.Noop;

        assertEquals(50.0, formula.calculateNewCowHealth(commons, user, 110));
        assertEquals(50.0, formula.calculateNewCowHealth(commons, user, 100));
        assertEquals(50.0, formula.calculateNewCowHealth(commons, user, 90));
    }
}
