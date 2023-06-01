package edu.ucsb.cs156.happiercows.models;

import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HealthUpdateStrategyListTests {

    HealthUpdateStrategyList value = HealthUpdateStrategyList.create();

    @Test
    void createdValueHasDefaults() {
        assertEquals(CowHealthUpdateStrategies.DEFAULT_ABOVE_CAPACITY.name(), value.getDefaultAboveCapacity());
        assertEquals(CowHealthUpdateStrategies.DEFAULT_BELOW_CAPACITY.name(), value.getDefaultBelowCapacity());
    }

    @Test
    void strategiesListMatchesEnumValues() {
        for (int i = 0; i < CowHealthUpdateStrategies.values().length; i++) {
            var listValue = value.getStrategies().get(i);
            var enumValue = CowHealthUpdateStrategies.values()[i];

            assertEquals(enumValue.name(), listValue.getName());
            assertEquals(enumValue.getDescription(), listValue.getDescription());
            assertEquals(enumValue.getDisplayName(), listValue.getDisplayName());
        }

    }
}
