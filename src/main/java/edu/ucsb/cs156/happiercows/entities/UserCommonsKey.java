package edu.ucsb.cs156.happiercows.entities;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import java.io.Serializable;


@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCommonsKey implements Serializable {
    @JoinColumn(name = "user_id")
    private long userId;

    @JoinColumn(name = "commons_id")
    private long commonsId;

}
