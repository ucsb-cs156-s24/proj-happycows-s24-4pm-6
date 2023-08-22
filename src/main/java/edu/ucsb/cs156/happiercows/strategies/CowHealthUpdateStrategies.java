package edu.ucsb.cs156.happiercows.strategies;


import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * The CowHealthUpdateStrategies enum provides a variety of strategies for updating cow health.
 *
 * For information on Java enum's, see the Oracle Java Tutorial on <a href="https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html">Enum Types</a>,
 * which are far more powerful in Java than enums in most other languages.
 */

@Getter
@AllArgsConstructor
public enum CowHealthUpdateStrategies implements CowHealthUpdateStrategy {

    Linear("Linear", "Cow health increases/decreases proportionally to the number of cows over/under the carrying capacity.") {
        @Override
        public double calculateNewCowHealth(CommonsPlus commonsPlus, UserCommons uC, int totalCows) {
            return uC.getCowHealth() - (totalCows - commonsPlus.getEffectiveCapacity()) * commonsPlus.getCommons().getDegradationRate();
        }
    },
    Constant("Constant", "Cow health changes increases/decreases by the degradation rate, depending on if the number of cows exceeds the carrying capacity.") {
        @Override
        public double calculateNewCowHealth(CommonsPlus commonsPlus, UserCommons uC, int totalCows) {
            if (totalCows <= commonsPlus.getEffectiveCapacity()) {
                return uC.getCowHealth() + commonsPlus.getCommons().getDegradationRate();
            } else {
                return uC.getCowHealth() - commonsPlus.getCommons().getDegradationRate();
            }
        }
    },
    Noop("Do nothing", "Cow health does not change.") {
        @Override
        public double calculateNewCowHealth(CommonsPlus commonsPlus, UserCommons uC, int totalCows) {
            return uC.getCowHealth();
        }
    };

    private final String displayName;
    private final String description;

    public final static CowHealthUpdateStrategies DEFAULT_ABOVE_CAPACITY = Linear;
    public final static CowHealthUpdateStrategies DEFAULT_BELOW_CAPACITY = Constant;
}
