package edu.ucsb.cs156.happiercows.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "commons")
public class Commons {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private double cowPrice;
    private double milkPrice;
    private double startingBalance;
    private LocalDateTime startingDate;
    private LocalDateTime lastDate;
    private boolean showLeaderboard;

    @Builder.Default
    private boolean showChat = true;
    
    private int capacityPerUser;
    private int carryingCapacity;
    private double degradationRate;

    // these defaults match old behavior
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CowHealthUpdateStrategies belowCapacityHealthUpdateStrategy = CowHealthUpdateStrategies.DEFAULT_BELOW_CAPACITY;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CowHealthUpdateStrategies aboveCapacityHealthUpdateStrategy = CowHealthUpdateStrategies.DEFAULT_ABOVE_CAPACITY;


    @OneToMany(mappedBy = "commons", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<UserCommons> joinedUsers;

    public boolean gameInProgress() {
        LocalDateTime today = LocalDateTime.now();
        if (startingDate.isBefore(today) && lastDate.isAfter(today)) {
            return true;
        }
        return false;
    }
}
