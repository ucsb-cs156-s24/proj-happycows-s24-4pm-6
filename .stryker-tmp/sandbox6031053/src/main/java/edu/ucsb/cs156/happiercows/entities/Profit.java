package edu.ucsb.cs156.happiercows.entities;

import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "profits")

public class Profit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
        @JoinColumn(name = "commons_id", referencedColumnName = "commons_id")
    })
    private UserCommons userCommons;
    private double amount;
    private LocalDateTime timestamp;
    private int numCows;
    private double avgCowHealth;
}
