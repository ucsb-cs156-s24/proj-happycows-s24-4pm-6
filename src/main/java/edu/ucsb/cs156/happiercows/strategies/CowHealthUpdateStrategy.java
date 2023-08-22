package edu.ucsb.cs156.happiercows.strategies;

import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

public interface CowHealthUpdateStrategy {

    public double calculateNewCowHealth(
            CommonsPlus commonsPlus,
            UserCommons user,
            int totalCows
    );

    public String getDisplayName();
    public String getDescription();
}
