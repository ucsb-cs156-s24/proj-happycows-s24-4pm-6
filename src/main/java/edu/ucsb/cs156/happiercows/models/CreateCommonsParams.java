package edu.ucsb.cs156.happiercows.models;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class CreateCommonsParams {
    private String name;
    @NumberFormat
    private double cowPrice;
    @NumberFormat
    private double milkPrice;
    @NumberFormat
    private double startingBalance;
    @DateTimeFormat
    private LocalDateTime startingDate;
    @DateTimeFormat
    private LocalDateTime lastDate;
    @Builder.Default
    private Boolean showLeaderboard = false;
    @NumberFormat
    private int capacityPerUser;
    @NumberFormat
    private int carryingCapacity;
    @NumberFormat
    private double degradationRate;

    private String aboveCapacityHealthUpdateStrategy;
    private String belowCapacityHealthUpdateStrategy;
}
