package edu.ucsb.cs156.happiercows.services;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

public interface CowHealthUpdateStrategy {

    public double calculateNewCowHealth(
            Commons commons,
            UserCommons user,
            int totalCows
    );

    public String getDisplayName();
    public String getDescription();
}
