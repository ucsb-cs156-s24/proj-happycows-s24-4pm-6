package edu.ucsb.cs156.happiercows.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;

@Service("CommonsPlusBuilderService")
public class CommonsPlusBuilderService {
    
    @Autowired
    CommonsRepository commonsRepository;

    public CommonsPlus toCommonsPlus(Commons c) {
        Optional<Integer> numCows = commonsRepository.getNumCows(c.getId());
        Optional<Integer> numUsers = commonsRepository.getNumUsers(c.getId());

        return CommonsPlus.builder()
                .commons(c)
                .totalCows(numCows.orElse(0))
                .totalUsers(numUsers.orElse(0))
                .build();
    }


    public Iterable<CommonsPlus> convertToCommonsPlus(Iterable<Commons> iteOfCommons) {
        List<Commons> commonsList = new ArrayList<Commons>();
        iteOfCommons.forEach(commonsList::add);

        List<CommonsPlus> commonsPlusList = commonsList.stream().map((c) -> toCommonsPlus(c)).collect(Collectors.toList());

        ArrayList<CommonsPlus> commonsPlusArrayList = new ArrayList<CommonsPlus>(commonsPlusList);

        return commonsPlusArrayList;
    }
}
