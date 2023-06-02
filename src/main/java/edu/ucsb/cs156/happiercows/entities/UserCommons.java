package edu.ucsb.cs156.happiercows.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "user_commons")
public class UserCommons {
    @EmbeddedId
    @JsonIgnore
    private UserCommonsKey id;

    private String username;

    private double totalWealth;

    private int numOfCows;

    private double cowHealth;

    @JsonIgnore
    public User getUser() {
        return id.getUser();
    }

    @JsonIgnore
    public Commons getCommons() {
        return id.getCommons();
    }

    @JsonInclude
    public long getUserId() {
        return id.getUser().getId();
    }

    @JsonInclude
    public long getCommonsId() {
        return id.getCommons().getId();
    }
}
