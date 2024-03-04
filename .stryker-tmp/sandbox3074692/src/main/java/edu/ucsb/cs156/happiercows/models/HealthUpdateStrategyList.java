package edu.ucsb.cs156.happiercows.models;

import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;
import lombok.Builder;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
@Builder
public class HealthUpdateStrategyList {
    private List<HealthUpdateStrategyInfo> strategies;
    private String defaultAboveCapacity;
    private String defaultBelowCapacity;


    public static HealthUpdateStrategyList create() {
        var strategies = CowHealthUpdateStrategies.values();
        var strategiesAsInfo = Arrays.stream(strategies)
                .map(strategy -> new HealthUpdateStrategyInfo(
                        strategy.name(),
                        strategy.getDisplayName(),
                        strategy.getDescription()
                ))
                .toList();

        return HealthUpdateStrategyList.builder()
                .strategies(strategiesAsInfo)
                .defaultAboveCapacity(CowHealthUpdateStrategies.DEFAULT_ABOVE_CAPACITY.name())
                .defaultBelowCapacity(CowHealthUpdateStrategies.DEFAULT_BELOW_CAPACITY.name())
                .build();
    }
}
