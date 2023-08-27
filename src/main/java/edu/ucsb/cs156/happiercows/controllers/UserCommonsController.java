package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.errors.NoCowsException;
import edu.ucsb.cs156.happiercows.errors.NotEnoughMoneyException;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;

@Tag(name = "User Commons")
@RequestMapping("/api/usercommons")
@RestController
public class UserCommonsController extends ApiController {

  @Autowired
  private UserCommonsRepository userCommonsRepository;

  @Autowired
  private CommonsRepository commonsRepository;

  @Autowired
  ObjectMapper mapper;

  @Operation(summary = "Get a specific user commons (admin only)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("")
  public UserCommons getUserCommonsById(
      @Parameter(name="userId") @RequestParam Long userId,
      @Parameter(name="commonsId") @RequestParam Long commonsId) throws JsonProcessingException {

    UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));
    return userCommons;
  }

  @Operation(summary = "Get a user commons for current user")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/forcurrentuser")
  public UserCommons getUserCommonsById(
      @Parameter(name="commonsId") @RequestParam Long commonsId) throws JsonProcessingException {

    User u = getCurrentUser().getUser();
    Long userId = u.getId();
    UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));
    return userCommons;
  }

  @Operation(summary = "Buy a cow, totalWealth updated")
  @PreAuthorize("hasRole('ROLE_USER')")
  @PutMapping("/buy")
  public ResponseEntity<String> putUserCommonsByIdBuy(
          @Parameter(name="commonsId") @RequestParam Long commonsId) throws NotEnoughMoneyException, JsonProcessingException{

        User u = getCurrentUser().getUser();
        Long userId = u.getId();

        Commons commons = commonsRepository.findById(commonsId).orElseThrow( 
          ()->new EntityNotFoundException(Commons.class, commonsId));
        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));

        if(userCommons.getTotalWealth() >= commons.getCowPrice() ){
          userCommons.setTotalWealth(userCommons.getTotalWealth() - commons.getCowPrice());
          userCommons.setNumOfCows(userCommons.getNumOfCows() + 1);
          userCommons.setCowsBought(userCommons.getCowsBought() + 1);
        }
        else{
          throw new NotEnoughMoneyException("You need more money!");
        }
        userCommonsRepository.save(userCommons);

        String body = mapper.writeValueAsString(userCommons);
        return ResponseEntity.ok().body(body);
    }

  @Operation(summary = "Sell a cow, totalWealth updated")
  @PreAuthorize("hasRole('ROLE_USER')")
  @PutMapping("/sell")
  public ResponseEntity<String> putUserCommonsByIdSell(
          @Parameter(name="commonsId") @RequestParam Long commonsId) throws NoCowsException, JsonProcessingException {
        User u = getCurrentUser().getUser();
        Long userId = u.getId();

        Commons commons = commonsRepository.findById(commonsId).orElseThrow( 
          ()->new EntityNotFoundException(Commons.class, commonsId));
        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));


        if(userCommons.getNumOfCows() >= 1 ){
          double cowValue = commons.getCowPrice() * userCommons.getCowHealth() / 100;
          userCommons.setTotalWealth(userCommons.getTotalWealth() + cowValue);
          userCommons.setNumOfCows(userCommons.getNumOfCows() - 1);
          userCommons.setCowsSold(userCommons.getCowsSold() + 1);
        }
        else{
          throw new NoCowsException("You have no cows to sell!");
        }
        userCommonsRepository.save(userCommons);

        String body = mapper.writeValueAsString(userCommons);
        return ResponseEntity.ok().body(body);
    }

    

    @Operation(summary = "Get all user commons for a specific commons")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/commons/all")
    public  ResponseEntity<String> getUsersCommonsByCommonsId(
        @Parameter(name="commonsId") @RequestParam Long commonsId) throws JsonProcessingException {
      Iterable<UserCommons> uc = userCommonsRepository.findByCommonsId(commonsId);
      
   
    String body = mapper.writeValueAsString(uc);
    return ResponseEntity.ok().body(body);
  }

}