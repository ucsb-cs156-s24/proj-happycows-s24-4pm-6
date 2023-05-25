package edu.ucsb.cs156.happiercows.services;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CowHealthUpdateStrategies implements CowHealthUpdateStrategy {

    Linear("Linear", "Cow health increases/decreases proportionally to the number of cows over/under the carrying capacity.") {
        @Override
        public double calculateNewCowHealth(Commons commons, UserCommons user, int totalCows) {
            return user.getCowHealth() - (totalCows - commons.getCarryingCapacity()) * commons.getDegradationRate();
        }
    },
    Constant("Constant", "Cow health changes increases/decreases by the degradation rate, depending on if the number of cows exceeds the carrying capacity.") {
        @Override
        public double calculateNewCowHealth(Commons commons, UserCommons user, int totalCows) {
            if (totalCows <= commons.getCarryingCapacity()) {
                return user.getCowHealth() + commons.getDegradationRate();
            } else {
                return user.getCowHealth() - commons.getDegradationRate();
            }
        }
    },
    Noop("Do nothing", "Cow health does not change.") {
        @Override
        public double calculateNewCowHealth(Commons commons, UserCommons user, int totalCows) {
            return user.getCowHealth();
        }
    };

    private final String displayName;
    private final String description;
}
