package edu.ucsb.cs156.happiercows.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "user_commons")
public class UserCommons {
    @EmbeddedId
    @JsonIgnore
    @Builder.Default
    private UserCommonsKey id = new UserCommonsKey();

    @MapsId("userId")
    @ManyToOne
    @JsonIgnore
    private User user;

    @MapsId("commonsId")
    @ManyToOne
    @JsonIgnore
    private Commons commons;

    private String username;

    private double totalWealth;

    private int numOfCows;

    private double cowHealth;

    private int cowsBought;

    private int cowsSold;

    private int cowDeaths;

    // userID and commonsId are used by the frontend
    @JsonInclude
    public long getUserId() {
      return user.getId();
    }

    @JsonInclude
    public long getCommonsId() {
        return commons.getId();
    }

    public void setId(UserCommonsKey id) {
        this.id = id;
    }
    
    public UserCommonsKey getId() {
        return this.id;
    }
}
