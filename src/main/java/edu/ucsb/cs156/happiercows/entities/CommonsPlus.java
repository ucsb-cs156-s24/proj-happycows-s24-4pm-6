package edu.ucsb.cs156.happiercows.entities;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import edu.ucsb.cs156.happiercows.services.CommonsPlusBuilderService;


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

    @JsonIgnore
    public static Iterable<CommonsPlus> convertToCommonsPlus(Iterable<Commons> iteOfCommons) {
        List<Commons> commonsList = new ArrayList<Commons>();
        iteOfCommons.forEach(commonsList::add);
        
        CommonsPlusBuilderService commonsPlusBuilderService = new CommonsPlusBuilderService();

        List<CommonsPlus> commonsPlusList = commonsList.stream().map((c) -> commonsPlusBuilderService.toCommonsPlus(c)).collect(Collectors.toList());

        ArrayList<CommonsPlus> commonsPlusArrayList = new ArrayList<CommonsPlus>(commonsPlusList);

        return commonsPlusArrayList;
    }

}