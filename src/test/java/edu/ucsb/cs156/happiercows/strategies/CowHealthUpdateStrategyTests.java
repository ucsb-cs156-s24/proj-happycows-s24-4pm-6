package edu.ucsb.cs156.happiercows.strategies;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.services.CommonsPlusBuilderService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
class CowHealthUpdateStrategyTests {

    Commons commons = Commons.builder()
    .degradationRate(0.01)
    .capacityPerUser(20)
    .carryingCapacity(100)
    .build();
    UserCommons user = UserCommons.builder().cowHealth(50).build();

    CommonsPlus commonsPlus = CommonsPlus.builder().commons(commons).totalCows(0).totalUsers(1).build();
    
    @Test
    void get_name_and_description() {
        assertEquals("Linear", CowHealthUpdateStrategies.Linear.name());
        assertEquals("Linear", CowHealthUpdateStrategies.Linear.getDisplayName());
        assertEquals("Cow health increases/decreases proportionally to the number of cows over/under the carrying capacity.", CowHealthUpdateStrategies.Linear.getDescription());
    }



    @Test
    void linear_updates_health_proportional_to_num_cows_over_capacity() {
        var formula = CowHealthUpdateStrategies.Linear;

        assertEquals(49.9, formula.calculateNewCowHealth(commonsPlus, user, 110));
        assertEquals(50.0, formula.calculateNewCowHealth(commonsPlus, user, 100));
        assertEquals(50.1, formula.calculateNewCowHealth(commonsPlus, user, 90));
    }

    @Test
    void constant_changes_by_constant_amount() {
        var formula = CowHealthUpdateStrategies.Constant;

        assertEquals(49.99, formula.calculateNewCowHealth(commonsPlus, user, 120));
        assertEquals(49.99, formula.calculateNewCowHealth(commonsPlus, user, 110));
        assertEquals(50.01, formula.calculateNewCowHealth(commonsPlus, user, 100));
        assertEquals(50.01, formula.calculateNewCowHealth(commonsPlus, user, 90));
    }

    @Test
    void noop_does_nothing() {
        var formula = CowHealthUpdateStrategies.Noop;

        assertEquals(50.0, formula.calculateNewCowHealth(commonsPlus, user, 110));
        assertEquals(50.0, formula.calculateNewCowHealth(commonsPlus, user, 100));
        assertEquals(50.0, formula.calculateNewCowHealth(commonsPlus, user, 90));
    }
}
