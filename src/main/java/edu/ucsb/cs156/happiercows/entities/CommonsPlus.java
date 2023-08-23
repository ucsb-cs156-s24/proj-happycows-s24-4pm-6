package edu.ucsb.cs156.happiercows.entities;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonGetter;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommonsPlus {
    private Commons commons;
    private Integer totalCows;
    private Integer totalUsers;


    @JsonGetter("effectiveCapacity")
    public int getEffectiveCapacity() {
        return Math.max(commons.getCapacityPerUser() * totalUsers, commons.getCarryingCapacity());
    }


}