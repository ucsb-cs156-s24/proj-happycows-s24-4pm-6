package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "Profits")
@RequestMapping("/api/profits")
@RestController
public class ProfitsController extends ApiController {

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Autowired
    ProfitRepository profitRepository;

    @Operation(summary = "Get all profits belonging to a user commons as a admin via CommonsID and UserId")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public Iterable<Profit> allProfitsByCommonsId(
            @Parameter(name="userId") @RequestParam Long userId,
            @Parameter(name="commonsId") @RequestParam Long commonsId

    ) {

        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
            .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));

        Iterable<Profit> profits = profitRepository.findAllByUserCommons(userCommons);

        return profits;
    }
    @Operation(summary = "Get all profits belonging to a user commons as a user via CommonsID")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all/commonsid")
    public Iterable<Profit> allProfitsByCommonsId(
            @Parameter(name="commonsId") @RequestParam Long commonsId
    ) {
        Long userId = getCurrentUser().getUser().getId();

        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
            .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));

        Iterable<Profit> profits = profitRepository.findAllByUserCommons(userCommons);

        return profits;
    }

    @Operation(summary = "Get all profits belonging to a user commons as a user via CommonsID with pagination")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/paged/commonsid")
    public Page<Profit> allProfitsByCommonsIdWithPagination(
            @Parameter(name = "commonsId") @RequestParam Long commonsId,
            @Parameter(name = "pageNumber", description = "Page number, 0 indexed") @RequestParam(defaultValue = "0") int pageNumber,
            @Parameter(name = "pageSize", description = "Number of records per page") @RequestParam(defaultValue = "7") int pageSize

    ) {
        Long userId = getCurrentUser().getUser().getId();

        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
                .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));

        Iterable<Profit> iterableProfits = profitRepository.findAllByUserCommons(userCommons);

        List<Profit> allProfits = new ArrayList<>();
        iterableProfits.forEach(allProfits::add);

        int start = pageNumber * pageSize;
        int end = Math.min((start + pageSize), allProfits.size());
        List<Profit> paginatedProfits = allProfits.subList(start, end);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Profit> profitsPage = new PageImpl<>(paginatedProfits, pageable, allProfits.size());

        return profitsPage;
    }
}
